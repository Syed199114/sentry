import {useCallback, useState} from 'react';
import type {MultiValueProps} from 'react-select';
import type {Theme} from '@emotion/react';
import {useTheme} from '@emotion/react';
import styled from '@emotion/styled';

import type {StylesConfig} from 'sentry/components/forms/controls/selectControl';
import SelectControl from 'sentry/components/forms/controls/selectControl';
import RoleSelectControl from 'sentry/components/roleSelectControl';
import TeamSelector from 'sentry/components/teamSelector';
import {t} from 'sentry/locale';
import {space} from 'sentry/styles/space';
import type {SelectValue} from 'sentry/types/core';
import type {OrgRole} from 'sentry/types/organization';

import renderEmailValue from './renderEmailValue';
import type {InviteStatus} from './types';

type SelectOption = SelectValue<string>;

type Props = {
  disabled: boolean;
  emails: string[];
  inviteStatus: InviteStatus;
  onChangeEmails: (emails: SelectOption[]) => void;
  onChangeRole: (role: SelectOption) => void;
  onChangeTeams: (teams: SelectOption[]) => void;
  onRemove: () => void;
  role: string;
  roleDisabledUnallowed: boolean;
  roleOptions: OrgRole[];
  teams: string[];
};

function ValueComponent(
  props: MultiValueProps<SelectOption>,
  inviteStatus: Props['inviteStatus']
) {
  return renderEmailValue(inviteStatus[props.data.value], props);
}

function mapToOptions(values: string[]): SelectOption[] {
  return values.map(value => ({value, label: value}));
}

function InviteRowControl({
  disabled,
  emails,
  role,
  teams,
  roleOptions,
  roleDisabledUnallowed,
  inviteStatus,
  onRemove,
  onChangeEmails,
  onChangeRole,
  onChangeTeams,
}: Props) {
  const [inputValue, setInputValue] = useState('');

  const theme = useTheme();

  const isTeamRolesAllowedForRole = useCallback<(roleId: string) => boolean>(
    roleId => {
      const roleOptionsMap = roleOptions.reduce(
        (rolesMap, roleOption) => ({...rolesMap, [roleOption.id]: roleOption}),
        {}
      );
      return roleOptionsMap[roleId]?.isTeamRolesAllowed ?? true;
    },
    [roleOptions]
  );
  const isTeamRolesAllowed = isTeamRolesAllowedForRole(role);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
      case 'Enter':
      case ',':
      case ' ':
        handleInput(inputValue);
        setInputValue('');
        event.preventDefault();
        break;
      default:
      // do nothing.
    }
  };

  const handleInput = input => {
    const newEmails = input.trim() ? input.trim().split(/[\s,]+/) : [];
    if (newEmails.length > 0) {
      onChangeEmails([
        ...mapToOptions(emails),
        ...newEmails.map(email => ({label: email, value: email})),
      ]);
    }
  };

  return (
    <RowWrapper>
      <div>
        <Heading>Email addresses</Heading>
        <SelectControl
          aria-label={t('Email Addresses')}
          data-test-id="select-emails"
          disabled={disabled}
          placeholder={t('Enter one or more emails')}
          inputValue={inputValue}
          value={emails}
          components={{
            MultiValue: props => ValueComponent(props, inviteStatus),
            DropdownIndicator: () => null,
          }}
          options={mapToOptions(emails)}
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput(e.target.value);
          }}
          styles={getStyles(theme, inviteStatus)}
          onInputChange={setInputValue}
          onKeyDown={handleKeyDown}
          onChange={onChangeEmails}
          multiple
          creatable
          clearable
          onClear={onRemove}
          menuIsOpen={false}
        />
      </div>
      <RoleTeamWrapper>
        <div>
          <Heading>Role</Heading>
          <RoleSelectControl
            aria-label={t('Role')}
            data-test-id="select-role"
            disabled={disabled}
            value={role}
            roles={roleOptions}
            disableUnallowed={roleDisabledUnallowed}
            onChange={roleOption => {
              onChangeRole(roleOption);
              if (!isTeamRolesAllowedForRole(roleOption.value)) {
                onChangeTeams([]);
              }
            }}
          />
        </div>
        <div>
          <Heading>Add to team</Heading>
          <TeamSelector
            aria-label={t('Add to Team')}
            data-test-id="select-teams"
            disabled={isTeamRolesAllowed ? disabled : true}
            placeholder={isTeamRolesAllowed ? t('None') : t('Role cannot join teams')}
            value={isTeamRolesAllowed ? teams : []}
            onChange={onChangeTeams}
            useTeamDefaultIfOnlyOne
            multiple
            clearable
          />
        </div>
      </RoleTeamWrapper>
    </RowWrapper>
  );
}

/**
 * The email select control has custom selected item states as items
 * show their delivery status after the form is submitted.
 */
function getStyles(theme: Theme, inviteStatus: Props['inviteStatus']): StylesConfig {
  return {
    multiValue: (provided, {data}: MultiValueProps<SelectOption>) => {
      const status = inviteStatus[data.value];
      return {
        ...provided,
        ...(status?.error
          ? {
              color: theme.red400,
              border: `1px solid ${theme.red300}`,
              backgroundColor: theme.red100,
            }
          : {}),
      };
    },
    multiValueLabel: (provided, {data}: MultiValueProps<SelectOption>) => {
      const status = inviteStatus[data.value];
      return {
        ...provided,
        pointerEvents: 'all',
        ...(status?.error ? {color: theme.red400} : {}),
      };
    },
    multiValueRemove: (provided, {data}: MultiValueProps<SelectOption>) => {
      const status = inviteStatus[data.value];
      return {
        ...provided,
        ...(status?.error
          ? {
              borderLeft: `1px solid ${theme.red300}`,
              ':hover': {backgroundColor: theme.red100, color: theme.red400},
            }
          : {}),
      };
    },
  };
}

const Heading = styled('div')`
  margin-bottom: ${space(1)};
  font-weight: ${p => p.theme.fontWeightBold};
  text-transform: uppercase;
  font-size: ${p => p.theme.fontSizeSmall};
`;

const RowWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${space(1.5)};
`;

const RoleTeamWrapper = styled('div')`
  display: grid;
  gap: ${space(1.5)};
  grid-template-columns: 1fr 1fr;
  align-items: start;
`;

export default InviteRowControl;
