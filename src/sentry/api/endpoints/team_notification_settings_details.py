from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from sentry.api.api_publish_status import ApiPublishStatus
from sentry.api.base import region_silo_endpoint
from sentry.api.bases.team import TeamEndpoint
from sentry.api.serializers import serialize
from sentry.api.serializers.models.notification_setting import NotificationSettingsSerializer
from sentry.api.validators.notifications import validate, validate_type_option
from sentry.models.team import Team
from sentry.services.hybrid_cloud.notifications import notifications_service
from sentry.services.hybrid_cloud.organization.serial import serialize_rpc_team


@region_silo_endpoint
class TeamNotificationSettingsDetailsEndpoint(TeamEndpoint):
    publish_status = {
        "GET": ApiPublishStatus.UNKNOWN,
        "PUT": ApiPublishStatus.UNKNOWN,
    }
    """
    This Notification Settings endpoint is the generic way to interact with the
    NotificationSettings table via the API.
    """

    def get(self, request: Request, team: Team) -> Response:
        """
        Get the Notification Settings for a given User.
        ````````````````````````````````
        :pparam string team_slug: The slug of the team to get.
        :qparam string type: If set, filter the NotificationSettings to this type.
        :auth required:
        """

        type_option = validate_type_option(request.GET.get("type"))

        return Response(
            serialize(
                team,
                request.user,
                NotificationSettingsSerializer(),
                type=type_option,
            ),
        )

    def put(self, request: Request, team: Team) -> Response:
        """
        Update the Notification Settings for a given Team.
        ````````````````````````````````
        :pparam string team_slug: The slug of the team to get.
        :param map <anonymous>: The POST data for this request should be several
            nested JSON mappings. The bottommost value is the "value" of the
            notification setting and the order of scoping is:
              - type (str),
              - scope_type (str),
              - scope_identifier (int)
              - provider (str)
            Example: {
                "workflow": {
                    "project": {
                        1: {
                            "email": "always",
                            "slack": "always"
                        },
                        2: {
                            "email": "subscribe_only",
                            "slack": "subscribe_only"
                        }
                    }
                }
            }

        :auth required:
        """

        notification_settings = validate(request.data)
        notifications_service.update_settings_bulk(
            notification_settings=notification_settings,
            team=serialize_rpc_team(team),
            organization_id_for_team=team.organization_id,
        )

        return Response(status=status.HTTP_204_NO_CONTENT)
