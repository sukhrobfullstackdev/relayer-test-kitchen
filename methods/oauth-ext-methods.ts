import { type MethodConfig } from '@/components/method-group/method-group';
import { Extensions } from '@/const/extensions';
import { getMagicInstance } from '@/lib/magic';
import { type OAuthExtension } from '@magic-ext/oauth';

export const groupName = Extensions.OAUTH_V1;

const getDefaultRedirectUri = () => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return 'https://relayer-test-kitchen.vercel.app/';
};

export const methods: MethodConfig[] = [
  {
    name: 'oauth.loginWithRedirect({ provider, redirectURI })',
    description: 'Login with Legacy OAuth (redirect)',
    args: [
      { name: 'Provider', default: 'google' },
      {
        name: 'Redirect URI',
        default: getDefaultRedirectUri(),
      },
    ],
    func: async (provider: any, redirectURI: string) => {
      await getMagicInstance<[OAuthExtension]>().oauth.loginWithRedirect({
        provider,
        redirectURI,
      });
    },
  },

  {
    name: 'oauth.getRedirectResult()',
    description: 'Parse the OAuth redirect result.',
    func: async () => {
      const result =
        await getMagicInstance<[OAuthExtension]>().oauth.getRedirectResult();
      console.log('Redirect Result: ', result);
    },
  },
];
