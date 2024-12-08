import {
  postIssuer,
  postPublicAddress,
  postWithAuthToken,
} from '@/app/services/kitchen-server';
import { type MethodConfig } from '@/components/method-group/method-group';
import { setUser } from '@/store/config-slice';
import store from '@/store/store';

export const groupName = 'Admin';

const handleResponse = async (res: Response, logout?: boolean) => {
  const data = await res.json();
  console.log(data);

  if (res.ok) {
    alert(JSON.stringify(data));
    if (logout) {
      store.dispatch(setUser(null));
    }
  }
};

export const methods: MethodConfig[] = [
  {
    name: 'NOTE REGARDING ADMIN METHODS',
    description:
      'Relayer Test Kitchen is built using the secret key that is paired with the default public key of the app (pk_live_A6849AF1E65489A5). In order to use a different secret key, run Test Kitchen locally. Click "Execute" to view the instructions in the README.',
    func: () => {
      const readmeWindow = window.open(
        'https://github.com/magiclabs/relayer-test-kitchen#local-development',
        '_blank',
      );

      if (readmeWindow) {
        readmeWindow.focus();
      } else {
        console.error('Failed to open the window');
      }
    },
  },
  {
    name: 'token.getIssuer',
    description:
      'Returns the Decentralized ID of the Magic User who generated the DID Token.',
    args: [{ name: 'DID Token', default: '' }],
    func: async (didToken: string) => {
      const res = await postWithAuthToken(didToken, '/api/token/getIssuer');

      handleResponse(res);
    },
  },
  {
    name: 'token.getPublicAddress',
    description:
      'Gets the cryptographic public address of the Magic User who generated the supplied token.',
    args: [{ name: 'DID Token', default: '' }],
    func: async (didToken: string) => {
      const res = await postWithAuthToken(
        didToken,
        '/api/token/getPublicAddress',
      );

      handleResponse(res);
    },
  },
  {
    name: 'token.decode',
    description:
      'Decodes a Decentralized ID Token from a Base64 string into a tuple of its individual components.',
    args: [{ name: 'DID Token', default: '' }],
    func: async (didToken: string) => {
      const res = await postWithAuthToken(didToken, '/api/token/decode');

      handleResponse(res);
    },
  },
  {
    name: 'token.validate',
    description: 'Validates a Decentralized ID token.',
    args: [{ name: 'DID Token', default: '' }],
    func: async (didToken: string) => {
      const res = await postWithAuthToken(didToken, '/api/token/validate');

      handleResponse(res);
    },
  },
  {
    name: 'users.logoutByIssuer',
    description:
      "Logs a user out of all client-side Magic SDK sessions given the user's Decentralized ID.",
    args: [{ name: 'Issuer', default: '' }],
    func: async (issuer: string) => {
      const res = await postIssuer(issuer, '/api/users/logoutByIssuer');

      handleResponse(res, true);
    },
  },
  {
    name: 'users.logoutByPublicAddress',
    description:
      "Logs a user out of all client-side Magic SDK sessions given the user's public address.",
    args: [{ name: 'Public Address', default: '' }],
    func: async (publicAddress: string) => {
      const res = await postPublicAddress(
        publicAddress,
        '/api/users/logoutByPublicAddress',
      );

      handleResponse(res, true);
    },
  },
  {
    name: 'users.logoutByToken',
    description:
      "Logs a user out of all client-side Magic SDK sessions given the user's DID token.",
    args: [{ name: 'DID Token', default: '' }],
    func: async (didToken: string) => {
      const res = await postWithAuthToken(didToken, '/api/users/logoutByToken');

      handleResponse(res, true);
    },
  },
  {
    name: 'users.getMetadataByIssuer',
    description: 'Retrieves information about user by the supplied issuer.',
    args: [{ name: 'Issuer', default: '' }],
    func: async (issuer: string) => {
      const res = await postIssuer(issuer, '/api/users/getMetadataByIssuer');

      handleResponse(res);
    },
  },
  {
    name: 'users.getMetadataByPublicAddress',
    description:
      'Retrieves information about user by the supplied public address.',
    args: [{ name: 'Public Address', default: '' }],
    func: async (publicAddress: string) => {
      const res = await postPublicAddress(
        publicAddress,
        '/api/users/getMetadataByPublicAddress',
      );

      handleResponse(res);
    },
  },
  {
    name: 'users.getMetadataByToken',
    description: 'Retrieves information about user by the supplied DID Token.',
    args: [{ name: 'DID Token', default: '' }],
    func: async (didToken: string) => {
      const res = await postWithAuthToken(
        didToken,
        '/api/users/getMetadataByToken',
      );

      handleResponse(res);
    },
  },
  {
    name: 'users.getMetadataByIssuerAndWallet',
    description:
      'Retrieves information about user, including their multichain wallets, by the supplied issuer.',
    args: [{ name: 'Issuer', default: '' }],
    func: async (issuer: string) => {
      const res = await postIssuer(
        issuer,
        '/api/users/getMetadataByIssuerAndWallet',
      );

      handleResponse(res);
    },
  },
  {
    name: 'users.getMetadataByPublicAddressAndWallet',
    description:
      'Retrieves information about user, including their multichain wallets, by the supplied public address.',
    args: [{ name: 'Public Address', default: '' }],
    func: async (publicAddress: string) => {
      const res = await postPublicAddress(
        publicAddress,
        '/api/users/getMetadataByPublicAddressAndWallet',
      );

      handleResponse(res);
    },
  },
  {
    name: 'users.getMetadataByTokenAndWallet',
    description:
      'Retrieves information about user, including their multichain wallets, by the supplied DID Token.',
    args: [{ name: 'DID Token', default: '' }],
    func: async (didToken: string) => {
      const res = await postWithAuthToken(
        didToken,
        '/api/users/getMetadataByTokenAndWallet',
      );

      handleResponse(res);
    },
  },
  {
    name: 'utils.parseAuthorizationHeader',
    description: 'Parses the authorization header for a DID Token.',
    args: [{ name: '"Bearer " + DID Token', default: 'Bearer ' }],
    func: async (bearer: string) => {
      const res = await fetch('/api/utils/parseAuthorizationHeader', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: bearer,
        },
      });

      handleResponse(res);
    },
  },
];
