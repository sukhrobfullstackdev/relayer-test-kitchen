import { type MethodConfig } from '@/components/method-group/method-group';
import { Extensions } from '@/const/extensions';
import { getMagicInstance } from '@/lib/magic';
import { type OAuthExtension } from '@magic-ext/oauth2';

export const groupName = Extensions.OAUTH_V2;

const getDefaultRedirectUri = () => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return 'https://relayer-test-kitchen.vercel.app/';
};

export const methods: MethodConfig[] = [
  {
    name: 'oauth2.loginWithRedirect({ provider, redirectURI })',
    description: 'Login with OAuth (redirect)',
    args: [
      { name: 'Provider', default: 'google' },
      {
        name: 'Redirect URI',
        default: getDefaultRedirectUri(),
      },
    ],
    func: async (provider: any, redirectURI: string) => {
      console.log(
        'oauth2.loginWithRedirect method fired',
        getMagicInstance(),
        provider,
      );
      await getMagicInstance<[OAuthExtension]>().oauth2.loginWithRedirect({
        provider,
        redirectURI,
      });
    },
  },

  {
    name: 'oauth2.getRedirectResult()',
    description: 'Parse the OAuth redirect result V2.',
    func: async () => {
      const result =
        await getMagicInstance<[OAuthExtension]>().oauth2.getRedirectResult();
      console.log('oauth2.getRedirectResult success: ', result);
    },
  },
];
