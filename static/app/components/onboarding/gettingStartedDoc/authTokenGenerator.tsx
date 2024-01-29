import {createContext, Fragment, useContext, useState} from 'react';
import styled from '@emotion/styled';

import {addErrorMessage} from 'sentry/actionCreators/indicator';
import {t} from 'sentry/locale';
import type {OrgAuthToken} from 'sentry/types';
import {handleXhrErrorResponse} from 'sentry/utils/handleXhrErrorResponse';
import {useMutation} from 'sentry/utils/queryClient';
import type RequestError from 'sentry/utils/requestError/requestError';
import useApi from 'sentry/utils/useApi';
import useOrganization from 'sentry/utils/useOrganization';
import {useUser} from 'sentry/utils/useUser';

type OrgAuthTokenWithToken = OrgAuthToken & {token: string};

const AuthTokenGeneratorContext = createContext<{
  generateAuthToken: () => void;
  isLoading: boolean;
  authToken?: string;
}>({
  isLoading: false,
  generateAuthToken: () => {},
});

interface AuthTokenGeneratorProviderProps {
  children: React.ReactNode;
  projectSlug: string;
}

export function AuthTokenGeneratorProvider({
  children,
  projectSlug,
}: AuthTokenGeneratorProviderProps) {
  const api = useApi();
  const user = useUser();
  const organization = useOrganization();
  const [authToken, setAuthToken] = useState<string>();

  const {mutate: generateAuthToken, isLoading} = useMutation<
    OrgAuthTokenWithToken,
    RequestError
  >({
    mutationFn: () => {
      const currentDate = new Date().toISOString().slice(0, 10);
      const name = `Generated by ${user.name} for ${projectSlug} on ${currentDate}`;
      return api.requestPromise(`/organizations/${organization.slug}/org-auth-tokens/`, {
        method: 'POST',
        data: {
          name,
        },
      });
    },

    onSuccess: (token: OrgAuthTokenWithToken) => {
      setAuthToken(token.token);
    },
    onError: error => {
      const message = t('Failed to create a new auth token.');
      handleXhrErrorResponse(message, error);
      addErrorMessage(message);
    },
  });

  return (
    <AuthTokenGeneratorContext.Provider value={{authToken, isLoading, generateAuthToken}}>
      {children}
    </AuthTokenGeneratorContext.Provider>
  );
}

export function AuthTokenGenerator() {
  const {authToken, isLoading, generateAuthToken} = useContext(AuthTokenGeneratorContext);

  function handleClick() {
    generateAuthToken();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (['Enter', 'Space'].includes(event.key)) {
      generateAuthToken();
    }
  }

  if (authToken) {
    return <Fragment>{authToken}</Fragment>;
  }

  if (isLoading) {
    return <Wrapper isInteractive={false}>{t('Generating token...')}</Wrapper>;
  }

  return (
    <Wrapper
      isInteractive
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {t('Click to generate token')}
    </Wrapper>
  );
}

const Wrapper = styled('span')<{isInteractive: boolean}>`
  background: var(--prism-highlight-accent);
  border-radius: 4px;
  border: none;
  padding: 0px 2px;
  margin: 0 4px;

  ${p =>
    p.isInteractive &&
    `
  cursor: pointer;

  &:hover {
    background: var(--prism-highlight-background);
  }`}
`;
