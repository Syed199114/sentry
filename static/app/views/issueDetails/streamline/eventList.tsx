import {css, useTheme} from '@emotion/react';
import styled from '@emotion/styled';
import {Fragment} from 'react';
import {Button, LinkButton} from 'sentry/components/button';
import ButtonBar from 'sentry/components/buttonBar';

import GridEditable from 'sentry/components/gridEditable';
import {
  GridBodyCell,
  GridHead,
  GridHeadCell,
  GridResizer,
} from 'sentry/components/gridEditable/styles';
import Panel from 'sentry/components/panels/panel';
import {IconChevron} from 'sentry/icons';
import {t, tct} from 'sentry/locale';
import {space} from 'sentry/styles/space';
import type {Group} from 'sentry/types/group';
import type {Project} from 'sentry/types/project';

interface EventListProps {
  group: Group;
  project: Project;
}

export function EventList({}: EventListProps) {
  const currentRange = [0, 25];
  const totalCount = 259;
  const theme = useTheme();
  const grayText = css`
    color: ${theme.subText};
    font-weight: ${theme.fontWeightNormal};
  `;

  return (
    <Fragment>
      <EventListHeader>
        <EventListTitle>All Events</EventListTitle>
        <EventListHeaderItem>
          {tct('Showing [start]-[end] of [count]', {
            start: currentRange[0],
            end: currentRange[1],
            count: totalCount,
          })}
        </EventListHeaderItem>
        <EventListHeaderItem>
          <ButtonBar gap={0.25}>
            <LinkButton
              aria-label={t('Previous Page')}
              borderless
              size="xs"
              icon={<IconChevron direction="left" />}
              // disabled={no previous results?}
              // to={{
              //   pathname: `${baseEventsPath}${event.previousEventID}/`,
              //   query: {...location.query, referrer: 'previous-event'},
              // }}
              css={grayText}
            />
            <LinkButton
              aria-label={t('Next Page')}
              borderless
              size="xs"
              icon={<IconChevron direction="right" />}
              css={grayText}
              // disabled={no previous results?}
              // to={{
              //   pathname: `${baseEventsPath}${event.previousEventID}/`,
              //   query: {...location.query, referrer: 'previous-event'},
              // }}
            />
          </ButtonBar>
        </EventListHeaderItem>
        <EventListHeaderItem>
          <Button borderless size="xs" css={grayText}>
            {t('Close')}
          </Button>
        </EventListHeaderItem>
      </EventListHeader>
      <StreamlineGridEditable>
        <GridEditable
          columnOrder={testColumnOrder}
          columnSortBy={[]}
          data={testData}
          grid={{
            renderHeadCell: () => 'headCell',
            renderBodyCell: () => 'bodyCell',
          }}
        />
      </StreamlineGridEditable>
    </Fragment>
  );
}

const EventListHeader = styled('div')`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: ${space(1.5)};
  align-items: center;
  padding: ${space(0.75)} ${space(2)};
  border-bottom: 1px solid ${p => p.theme.translucentBorder};
`;

const EventListTitle = styled('div')`
  color: ${p => p.theme.textColor};
  font-weight: ${p => p.theme.fontWeightBold};
  font-size: ${p => p.theme.fontSizeLarge};
`;

const EventListHeaderItem = styled('div')`
  color: ${p => p.theme.subText};
  font-weight: ${p => p.theme.fontWeightNormal};
  font-size: ${p => p.theme.fontSizeSmall};
`;

const StreamlineGridEditable = styled('div')`
  ${Panel} {
    border: 0;
  }
  ${GridHead} {
    min-height: unset;
    font-size: ${p => p.theme.fontSizeMedium};
    ${GridResizer} {
      height: 36px;
    }
  }
  ${GridHeadCell} {
    height: 36px;
    padding: 0 ${space(1.5)};
    text-transform: capitalize;
    border-width: 0 1px 0 0;
    border-style: solid;
    border-image: linear-gradient(
        to bottom,
        transparent,
        transparent 30%,
        ${p => p.theme.border} 30%,
        ${p => p.theme.border} 70%,
        transparent 70%,
        transparent
      )
      1;
    &:last-child {
      border: 0;
    }
  }
  ${GridBodyCell} {
    min-height: unset;
    padding: ${space(1)} ${space(1.5)};
    font-size: ${p => p.theme.fontSizeMedium};
  }
`;

const testColumnOrder = [
  {
    key: 'id',
    name: 'id',
    type: 'string',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'id',
    },
    width: -1,
  },
  {
    key: 'transaction',
    name: 'transaction',
    type: 'string',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'transaction',
    },
    width: -1,
  },
  {
    key: 'title',
    name: 'title',
    type: 'string',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'title',
    },
    width: -1,
  },
  {
    key: 'trace',
    name: 'trace',
    type: 'string',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'trace',
    },
    width: 32,
  },
  {
    key: 'timestamp',
    name: 'timestamp',
    type: 'date',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'timestamp',
    },
    width: -1,
  },
  {
    key: 'release',
    name: 'release',
    type: 'string',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'release',
    },
    width: -1,
  },
  {
    key: 'environment',
    name: 'environment',
    type: 'string',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'environment',
    },
    width: -1,
  },
  {
    key: 'user.display',
    name: 'user.display',
    type: 'string',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'user.display',
    },
    width: -1,
  },
  {
    key: 'device',
    name: 'device',
    type: 'never',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'device',
    },
    width: -1,
  },
  {
    key: 'os',
    name: 'os',
    type: 'string',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'os',
    },
    width: -1,
  },
  {
    key: 'url',
    name: 'url',
    type: 'never',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'url',
    },
    width: -1,
  },
  {
    key: 'browser',
    name: 'browser',
    type: 'never',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'browser',
    },
    width: -1,
  },
  {
    key: 'replayId',
    name: 'replayId',
    type: 'string',
    isSortable: false,
    column: {
      kind: 'field',
      field: 'replayId',
    },
    width: -1,
  },
];

const testData = [
  {
    'user.display': 'email@example.com',
    os: 'Mac OS X 10.15',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-17T18:21:50+00:00',
    trace: '0407ddf7402a453d83ee5745d6f4d129',
    environment: 'prod',
    browser: 'Firefox 129.0',
    replayId: '08f186377130461c8b09a6c35b43d418',
    url: 'https://sentry.io/issues/',
    id: 'e52bc4b9beb84f2cac3902b14583461e',
    release: 'frontend@c5fcb9fea92ba962ad6c7c55af5c2eb31c164034',
    device: 'Mac',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: 'Mac OS X 10.15',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-16T06:43:01+00:00',
    trace: '24967a5a0bec48b982c7e82d4ae09466',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: null,
    url: 'https://sentry.io/issues/',
    id: '242c2b5b7bd543a5ab0cf399b34d8f65',
    release: 'frontend@1a584ea878ba8a3ede14d23fd32ae68c300a334a',
    device: 'Mac',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: 'Mac OS X 10.15',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-13T15:07:24+00:00',
    trace: '50de4376a28243208b0b32d073582693',
    environment: 'prod',
    browser: 'Firefox 129.0',
    replayId: null,
    url: 'https://sentry.io/issues/',
    id: '87a7d310fb9e46e2828c6c66dd9bdd35',
    release: 'frontend@88d5750ee1ff96c7d62256fea664a9d5df1cf2b2',
    device: 'Mac',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:06+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'e0d970f4e6974c76adbdcfd89a2e10f1',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:06+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'e380417335c44046804178b84f6dd3c9',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:06+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '7eb835f232404aa8a50a07c1f08a95a4',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:06+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'cbc912e0d7ab4920983f7ef3447757a0',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:06+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'a12c5af1022c4441a002693a41da0368',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:06+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '3332e00d3e824e348faaf2eb5e5356e1',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:06+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '5e15660ba9eb43fcb7edddf855b32809',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:06+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '21512da177c5487c8260ceafe38cbbfd',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:06+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'a1c806f1e1cf4835ba28a538d9b58a6b',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:06+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '38a97beba171418f9a0841c9333c2278',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:05+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '6a827822e8694e7e9a4e95988ae9b8b3',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:05+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'be72ebb1be494c649b8dd27eea6dc50f',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:04+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '62489afd9347472eb4606c8c23b0a848',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:04+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '36dd677e5e444aba8b0163ae655a72ea',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:03+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '2339c72b8ec343a9a21437a69251b012',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:03+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '33c7b255776148a9be2a4999a7d3cd76',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:02+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'f6a274629e354ddb8be7abb2693c87d7',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:02+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '389c653dae5943f2ae6d9d3e8bfe5fcb',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:01+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '6a055302326a4202b43e9ab2dfcabbb3',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:01+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'de0fb7e328964084a7478bcc37d6eb28',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:00+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'c3be15fc879d4946aca0cae5408e7d6c',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:05:00+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '06640373002a480aa7f4154d50a06c86',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:59+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'b611e4d95c7e4aeb8067e35436cdcb2e',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:59+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '9bb1cf659f004a1a9a609b2b7a0074be',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:58+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'a570d42644844b859878321e1cd57650',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:57+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '4474600143f0460ab926ee04c88f424d',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:56+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'f94ccf1a406c42d591be0f9d13249d92',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:56+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '1d3513e10cf247cb9787d45f12808158',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:55+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '8b47463ae1e543e78b7810eaab77b41a',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:55+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '45f6ca6ab4ca4ab487690a053cde012b',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:54+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '4f8977d16a7e40a2bf637cec4e450c1e',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:54+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'e93bf18b61e34bf5a20f27c910c3a9f4',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:53+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '37d44545770e4f41b0a57a8719c83cf7',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:53+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '93bda411e1964e2f8124569de23b0138',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:52+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '7a7f910bd4f54b12947fabf054b5d48a',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:52+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '195e98762d6e4f469e33593f1f978f69',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:51+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '27043e4589e3457f8f6223093e425bfa',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:51+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '379eb2a28ef9411bbaaeae4641c37872',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:50+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '3bd46e8fa98f4d408658772889524175',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:50+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'fdc0724114b9416f88370c30ff2d0a18',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:49+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '4942f6f13354437cb3e1bff910d6a5a6',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:49+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: 'b6fdcbc7fca64aad8abb701bb534a931',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:48+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '9d1393f11a9d4f6bbe12d987f1f387b0',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:48+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '0c105615851e4ab38956c1344130d1bf',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:47+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '4f1da94e6ce04b96883d60a2e8c30845',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:47+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '9999b2d2974d412ba7cccc110c6aed02',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
  {
    'user.display': 'email@example.com',
    os: '',
    title:
      'Error: Unexpected context found on stack. This error is likely caused by a bug in React. Please file an ...',
    transaction: '/issues',
    timestamp: '2024-09-12T14:04:43+00:00',
    trace: 'f87a1bb3a19e4ffc86a14ce3caa1dbc2',
    environment: 'prod',
    browser: 'Firefox 130.0',
    replayId: 'c3a07f95932c47a89e763555a4518591',
    url: 'https://sentry.io/issues/',
    id: '122b0becb61444d491efdc2c10c2e4b6',
    release: 'frontend@3523870ad5f539fb861029cc0963c23444bda04b',
    device: '',
    'project.name': 'javascript',
    attachments: [],
  },
];
