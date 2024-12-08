import { type MethodConfig } from '@/components/method-group/method-group';
import { Extensions } from '@/const/extensions';
import { getMagicInstance } from '@/lib/magic';
import {
  setAuth0Domain,
  setAuth0Id,
  setAuth0ProviderId,
  setUser,
} from '@/store/config-slice';
import store from '@/store/store';
import { type OpenIdExtension } from '@magic-ext/oidc';

export const groupName = Extensions.OIDC;

export const methodArgToggle = { JWT: false }; // Set to true after you enable Custom Auth

export const methods: MethodConfig[] = [
  {
    name: 'openid.loginWithOIDC({ jwt, providerId })',
    description: 'Initiate a login via OIDC.',
    args: [
      {
        name: 'Encoded JWT',
        default: '',
      },
      {
        name: 'Provider ID',
        default: '',
      },
    ],
    func: async (jwt: string, providerId: string) => {
      await getMagicInstance<[OpenIdExtension]>().openid.loginWithOIDC({
        jwt,
        providerId,
      });
      alert('Login complete!');
    },
  },

  {
    name: 'openid.loginWithOIDC({ jwt, providerId }) [Auth0]',
    description:
      'Initiate a login for Auth0 via OIDC. NOTE: Requires 2 button clicks. First, click "Execute" to initiate the login with redirect. Once redirected back to the page, click a second time to complete the login flow.',
    args: [
      { name: 'Auth0 Id', default: store.getState().Config.auth0Id },
      { name: 'Auth0 Domain', default: store.getState().Config.auth0Domain },
      {
        name: 'Provider ID',
        default: store.getState().Config.auth0ProviderId,
      },
    ],
    func: async (auth0Id: string, auth0Domain: string, providerId: string) => {
      store.dispatch(setAuth0Id(auth0Id));
      store.dispatch(setAuth0Domain(auth0Domain));
      store.dispatch(setAuth0ProviderId(providerId));

      const doLogin = async () => {
        const { createAuth0Client } = window as any;
        const auth0 = await createAuth0Client({
          domain: auth0Domain,
          client_id: auth0Id,
        });

        const query = window.location.search;
        if (query.includes('code=') && query.includes('state=')) {
          console.log('Logging in...');
          await auth0.handleRedirectCallback();
          const claims = await auth0.getIdTokenClaims();
          console.log('JWT: ', claims.__raw);
          await getMagicInstance<[OpenIdExtension]>().openid.loginWithOIDC({
            jwt: claims.__raw,
            providerId,
          });
          window.history.replaceState({}, document.title, '/');
          console.log('Login complete');
          alert('Login complete!');
          store.dispatch(setUser(await getMagicInstance().user.getInfo()));
          store.dispatch(setAuth0Id(''));
          store.dispatch(setAuth0Domain(''));
          store.dispatch(setAuth0ProviderId(''));
        } else {
          await auth0.loginWithRedirect({
            redirect_uri: `${window.location.origin}`,
          });
        }
      };
      if (!(window as any).createAuth0Client) {
        const scrypter = document.createElement('script');
        scrypter.setAttribute(
          'src',
          'https://cdn.auth0.com/js/auth0-spa-js/1.20/auth0-spa-js.production.js',
        );
        document.body.appendChild(scrypter);
        // eslint-disable-next-line func-names
        scrypter.onload = function () {
          doLogin();
        };
      } else {
        doLogin();
      }
    },
  },

  {
    name: 'openid.loginWithOIDC({ jwt, providerId }) [Google]',
    description:
      'Initiate a login for google one tap via OIDC. NOTE: 1Password browser extensions can interfere with the pop up. If you receive a "Check credential status returns invalid response" console error, go to your 1Password extension settings, go to the "Autofill" section, and disable "Stop competing sign-in pop-ups in the browser".',
    args: [
      {
        name: 'Google Client Id',
        default: '',
      },
      {
        name: 'Provider ID',
        default: '',
      },
    ],
    func: async (gcid: string, providerId: string) => {
      const doLogin = async () => {
        console.log('Logging in...');
        const { google } = window as any;
        google.accounts.id.initialize({
          client_id: gcid,
          callback: async (result: any) => {
            console.log('JWT: ', result.credential);
            await getMagicInstance<[OpenIdExtension]>().openid.loginWithOIDC({
              jwt: result.credential,
              providerId,
            });
            console.log('Login complete');
            alert('Login complete!');
            store.dispatch(setUser(await getMagicInstance().user.getInfo()));
          },
        });
        google.accounts.id.prompt();
      };
      if (!(window as any).google) {
        const scrypter = document.createElement('script');
        scrypter.setAttribute('src', 'https://accounts.google.com/gsi/client');
        document.body.appendChild(scrypter);
        // eslint-disable-next-line func-names
        scrypter.onload = function () {
          doLogin();
        };
      } else {
        doLogin();
      }
    },
  },
];
