from enum import Enum
from typing import Optional, Sequence

from rest_framework.exceptions import ParseError
from rest_framework.request import Request
from rest_framework.response import Response

from sentry.api.api_owners import ApiOwner
from sentry.api.api_publish_status import ApiPublishStatus
from sentry.api.base import region_silo_endpoint
from sentry.api.bases.organization import OrganizationEndpoint
from sentry.api.exceptions import ResourceDoesNotExist
from sentry.api.paginator import GenericOffsetPaginator
from sentry.api.utils import get_date_range_from_params
from sentry.exceptions import InvalidParams
from sentry.models.project import Project
from sentry.sentry_metrics.querying.api import run_metrics_query
from sentry.sentry_metrics.querying.errors import (
    InvalidMetricsQueryError,
    LatestReleaseNotFoundError,
    MetricsQueryExecutionError,
)
from sentry.sentry_metrics.use_case_id_registry import UseCaseID
from sentry.sentry_metrics.utils import string_to_use_case_id
from sentry.sentry_metrics.visibility import (
    MalformedBlockedMetricsPayloadError,
    block_metric,
    block_tags_of_metric,
    unblock_metric,
    unblock_tags_of_metric,
)
from sentry.snuba.metrics import (
    QueryDefinition,
    get_all_tags,
    get_metrics_meta,
    get_series,
    get_single_metric_info,
    get_tag_values,
)
from sentry.snuba.metrics.naming_layer.mri import is_mri
from sentry.snuba.metrics.utils import DerivedMetricException, DerivedMetricParseException
from sentry.snuba.referrer import Referrer
from sentry.snuba.sessions_v2 import InvalidField
from sentry.utils.cursors import Cursor, CursorResult
from sentry.utils.dates import parse_stats_period


def get_use_case_id(request: Request) -> UseCaseID:
    """
    Get useCase from query params and validate it against UseCaseID enum type
    Raise a ParseError if the use_case parameter is invalid.
    """

    try:
        use_case_param = request.GET.get("useCase", "sessions")
        return string_to_use_case_id(use_case_param)
    except ValueError:
        raise ParseError(
            detail=f"Invalid useCase parameter. Please use one of: {[uc.value for uc in UseCaseID]}"
        )


class MetricOperationType(Enum):
    BLOCK_METRIC = "blockMetric"
    BLOCK_TAGS = "blockTags"
    UNBLOCK_METRIC = "unblockMetric"
    UNBLOCK_TAGS = "unblockTags"

    @classmethod
    def from_request(cls, request: Request) -> Optional["MetricOperationType"]:
        operation_type = request.data.get("operationType")
        if not operation_type:
            return None

        for operation in cls:
            if operation.value == operation_type:
                return operation

        return None

    @classmethod
    def available_ops(cls) -> Sequence[str]:
        return [operation.value for operation in cls]


@region_silo_endpoint
class OrganizationMetricsEndpoint(OrganizationEndpoint):
    publish_status = {"GET": ApiPublishStatus.EXPERIMENTAL, "PUT": ApiPublishStatus.EXPERIMENTAL}
    owner = ApiOwner.TELEMETRY_EXPERIENCE

    def _handle_by_operation_type(
        self, request: Request, project: Project, metric_operation_type: MetricOperationType
    ):
        metric_mri = request.data.get("metric_mri")
        if not is_mri(metric_mri):
            raise InvalidParams("You must supply a valid metric mri")

        if metric_operation_type == MetricOperationType.BLOCK_METRIC:
            block_metric(metric_mri, [project])
        elif metric_operation_type == MetricOperationType.UNBLOCK_METRIC:
            unblock_metric(metric_mri, [project])
        elif metric_operation_type == MetricOperationType.BLOCK_TAGS:
            tags = request.data.get("tags") or []
            block_tags_of_metric(metric_mri, set(tags), [project])
        elif metric_operation_type == MetricOperationType.UNBLOCK_TAGS:
            tags = request.data.get("tags") or []
            unblock_tags_of_metric(metric_mri, set(tags), [project])

    def get(self, request: Request, organization) -> Response:
        projects = self.get_projects(request, organization)
        if not projects:
            raise InvalidParams("You must supply at least one projects to see its metrics")

        metrics = get_metrics_meta(projects=projects, use_case_id=get_use_case_id(request))

        return Response(metrics, status=200)

    def put(self, request: Request, organization) -> Response:
        projects = self.get_projects(request, organization)
        if len(projects) != 1:
            raise InvalidParams("You can only apply an operation on a metric on a single project")

        metric_operation_type = MetricOperationType.from_request(request)
        if not metric_operation_type:
            raise InvalidParams(
                f"You must supply a valid operation, which must be one of {MetricOperationType.available_ops()}"
            )

        try:
            self._handle_by_operation_type(request, projects[0], metric_operation_type)
        except MalformedBlockedMetricsPayloadError:
            # In case one metric fails to be inserted, we abort the entire insertion since the project options are
            # likely to be corrupted.
            return Response(
                {"detail": "The blocked metrics settings are corrupted, try again"}, status=500
            )

        return Response(status=200)


@region_silo_endpoint
class OrganizationMetricsDetailsEndpoint(OrganizationEndpoint):
    publish_status = {
        "GET": ApiPublishStatus.EXPERIMENTAL,
    }
    owner = ApiOwner.TELEMETRY_EXPERIENCE

    """Get the metadata of all the stored metrics including metric name, available operations and metric unit"""

    def get(self, request: Request, organization) -> Response:
        # TODO: fade out endpoint since the new metrics endpoint will be used.
        projects = self.get_projects(request, organization)

        metrics = get_metrics_meta(projects=projects, use_case_id=get_use_case_id(request))

        return Response(metrics, status=200)


@region_silo_endpoint
class OrganizationMetricDetailsEndpoint(OrganizationEndpoint):
    publish_status = {
        "GET": ApiPublishStatus.EXPERIMENTAL,
    }
    owner = ApiOwner.TELEMETRY_EXPERIENCE

    """Get metric name, available operations, metric unit and available tags"""

    def get(self, request: Request, organization, metric_name) -> Response:
        projects = self.get_projects(request, organization)

        try:
            metric = get_single_metric_info(
                projects,
                metric_name,
                use_case_id=get_use_case_id(request),
            )
        except InvalidParams as exc:
            raise ResourceDoesNotExist(detail=str(exc))
        except (InvalidField, DerivedMetricParseException) as exc:
            raise ParseError(detail=str(exc))

        return Response(metric, status=200)


@region_silo_endpoint
class OrganizationMetricsTagsEndpoint(OrganizationEndpoint):
    publish_status = {
        "GET": ApiPublishStatus.EXPERIMENTAL,
    }
    owner = ApiOwner.TELEMETRY_EXPERIENCE

    """Get list of tag names for this project

    If the ``metric`` query param is provided, only tags for a certain metric
    are provided.

    If the ``metric`` query param is provided more than once, the *intersection*
    of available tags is used.
    """

    def get(self, request: Request, organization) -> Response:
        metric_names = request.GET.getlist("metric") or []
        projects = self.get_projects(request, organization)

        try:
            tags = get_all_tags(
                projects,
                metric_names,
                use_case_id=get_use_case_id(request),
            )
        except (InvalidParams, DerivedMetricParseException) as exc:
            raise (ParseError(detail=str(exc)))

        return Response(tags, status=200)


@region_silo_endpoint
class OrganizationMetricsTagDetailsEndpoint(OrganizationEndpoint):
    publish_status = {
        "GET": ApiPublishStatus.EXPERIMENTAL,
    }
    owner = ApiOwner.TELEMETRY_EXPERIENCE

    """Get all existing tag values for a metric"""

    def get(self, request: Request, organization, tag_name) -> Response:
        metric_names = request.GET.getlist("metric") or None
        projects = self.get_projects(request, organization)

        try:
            tag_values = get_tag_values(
                projects,
                tag_name,
                metric_names,
                use_case_id=get_use_case_id(request),
            )
        except (InvalidParams, DerivedMetricParseException) as exc:
            raise ParseError(str(exc))

        return Response(tag_values, status=200)


@region_silo_endpoint
class OrganizationMetricsDataEndpoint(OrganizationEndpoint):
    publish_status = {
        "GET": ApiPublishStatus.EXPERIMENTAL,
    }
    owner = ApiOwner.TELEMETRY_EXPERIENCE

    """Get the time series data for one or more metrics.

    The data can be filtered and grouped by tags.
    Based on `OrganizationSessionsEndpoint`.
    """

    # Number of groups returned for each page (applies to old endpoint).
    default_per_page = 50
    # Number of groups returned (applies to new endpoint).
    default_limit = 20

    def _new_get(self, request: Request, organization) -> Response:
        # We first parse the interval and date, since this is dependent on the query params.
        interval = parse_stats_period(request.GET.get("interval", "1h"))
        interval = int(3600 if interval is None else interval.total_seconds())
        start, end = get_date_range_from_params(request.GET)

        limit = request.GET.get("limit")
        if not limit:
            limit = self.default_limit
        else:
            try:
                limit = int(limit)
            except ValueError:
                return Response(
                    status=400,
                    data={"detail": "The provided `limit` is invalid, an integer is required"},
                )

        try:
            results = run_metrics_query(
                fields=request.GET.getlist("field", []),
                interval=interval,
                start=start,
                end=end,
                organization=organization,
                projects=self.get_projects(request, organization),
                environments=self.get_environments(request, organization),
                referrer=Referrer.API_DDM_METRICS_DATA.value,
                # Optional parameters.
                query=request.GET.get("query"),
                group_bys=request.GET.getlist("groupBy"),
                order_by=request.GET.get("orderBy"),
                limit=limit,
            )
        except InvalidMetricsQueryError as e:
            return Response(status=400, data={"detail": str(e)})
        except LatestReleaseNotFoundError as e:
            return Response(status=404, data={"detail": str(e)})
        except MetricsQueryExecutionError as e:
            return Response(status=500, data={"detail": str(e)})

        return Response(status=200, data=results)

    def _old_get(self, request: Request, organization) -> Response:
        projects = self.get_projects(request, organization)

        def data_fn(offset: int, limit: int):
            try:
                query = QueryDefinition(
                    projects,
                    request.GET,
                    allow_mri=True,
                    paginator_kwargs={"limit": limit, "offset": offset},
                )
                data = get_series(
                    projects,
                    metrics_query=query.to_metrics_query(),
                    use_case_id=get_use_case_id(request),
                    tenant_ids={"organization_id": organization.id},
                )
                data["query"] = query.query
            except (
                InvalidParams,
                DerivedMetricException,
            ) as exc:
                raise (ParseError(detail=str(exc)))
            return data

        return self.paginate(
            request,
            paginator=MetricsDataSeriesPaginator(data_fn=data_fn),
            default_per_page=self.default_per_page,
            max_per_page=100,
        )

    def get(self, request: Request, organization) -> Response:
        use_new_metrics_layer = request.GET.get("useNewMetricsLayer", "false") == "true"
        if use_new_metrics_layer:
            return self._new_get(request, organization)
        else:
            return self._old_get(request, organization)


class MetricsDataSeriesPaginator(GenericOffsetPaginator):
    def get_result(self, limit, cursor=None):
        assert limit > 0
        offset = cursor.offset if cursor is not None else 0
        data = self.data_fn(offset=offset, limit=limit + 1)

        if isinstance(data.get("groups"), list):
            has_more = len(data["groups"]) == limit + 1
            if has_more:
                data["groups"].pop()
        else:
            raise NotImplementedError

        return CursorResult(
            data,
            prev=Cursor(0, max(0, offset - limit), True, offset > 0),
            next=Cursor(0, max(0, offset + limit), False, has_more),
        )
