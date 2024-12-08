import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';

const TEN_YEARS = 3.154e8; // Ten years in seconds

export const groupName = 'DID Token Factories (Magic)';

export const methods: MethodConfig[] = [
  {
    isAdminMethod: true,
    name: 'Create a Valid DIDT (Long-lived; 10 years; no attachment; Admin.getIssuer)',
    args: [
      {
        name: 'Login Email',
        default: 'ian@fortmatic.com',
        fallbackGlobalStateKey: 'magicAuthEmail',
      },
    ],
    func: async (email: string, secretKey: string) => {
      try {
        console.log('secretKey', secretKey);
        console.log('--- Generating a valid DIDT (no attachment) ---');

        const m = getMagicInstance();
        await m.auth.loginWithMagicLink({ email });
        const token = await m.user.getIdToken({ lifespan: TEN_YEARS });

        console.log('Valid DIDT:\n', token);
        console.log('Proof:\n', JSON.parse(atob(token))[0]);
        console.log('Claim (stringified):\n', JSON.parse(atob(token))[1]);
        console.log(
          'Claim (parsed):\n',
          JSON.parse(JSON.parse(atob(token))[1]),
        );

        console.log('--- /Generating a valid DIDT (no attachment) ---');

        // const res = await getIssuer(token, secretKey);

        // console.log('--- get Issuer from a valid DIDT (no attachment) ---');
        // console.log('Issuer:\n', res);
        // console.log('--- /get Issuer from a valid DIDT (no attachment) ---');
      } catch (err) {
        console.error(err);
      }
    },
  },

  {
    name: 'Create a Valid DIDT (Long-lived; 10 years; with attachment; admin.decode; admin.getPublicAddress)',
    args: [
      {
        name: 'Login Email',
        default: 'ian@fortmatic.com',
        fallbackGlobalStateKey: 'magicAuthEmail',
      },
      { name: 'Additional Signed Secret', default: 'hello world' },
    ],
    func: async (email: string, attachment: string, _secretkey: string) => {
      try {
        console.log('--- Generating a valid DIDT (with attachment) ---');

        const m = getMagicInstance();
        await m.auth.loginWithMagicLink({ email });
        const token = await m.user.generateIdToken({
          lifespan: TEN_YEARS,
          attachment,
        });

        console.log('Valid DIDT:\n', token);
        console.log('Proof:\n', JSON.parse(atob(token))[0]);
        console.log('Claim (stringified):\n', JSON.parse(atob(token))[1]);
        console.log(
          'Claim (parsed):\n',
          JSON.parse(JSON.parse(atob(token))[1]),
        );

        console.log('--- /Generating a valid DIDT (with attachment) ---');

        // const res = await decode(token, secretkey);
        // const publicAddress = await getPublicAddress(token, secretkey);
        // console.log('--- Decode from a valid DIDT (with attachment) ---');
        // console.log('Decode:\n', res);
        // console.log('Public Address:\n', publicAddress);
        // console.log('--- /Decode from a valid DIDT (with attachment) ---');
      } catch (err) {
        console.error(err);
      }
    },
  },

  {
    name: 'Create an Invalid DIDT (Malformed Claim);',
    args: [
      {
        name: 'Login Email',
        default: 'ian@fortmatic.com',
        fallbackGlobalStateKey: 'magicAuthEmail',
      },
    ],
    func: async (email: string) => {
      try {
        console.log('--- Generating an invalid DIDT (malformed claim) ---');

        const m = getMagicInstance();
        await m.auth.loginWithMagicLink({ email });
        const token = await m.user.getIdToken({ lifespan: TEN_YEARS });

        const proof = JSON.parse(atob(token))[0];
        const modifiedToken = btoa(
          JSON.stringify([
            proof,
            JSON.stringify({ thisIsWRONG: 'HELLO WORLD' }),
          ]),
        );

        console.log('Invalid DIDT:\n', modifiedToken);
        console.log('Proof:\n', proof);
        console.log(
          'Claim (stringified):\n',
          JSON.parse(atob(modifiedToken))[1],
        );
        console.log(
          'Claim (parsed):\n',
          JSON.parse(JSON.parse(atob(modifiedToken))[1]),
        );

        console.log('--- /Generating an invalid DIDT (malformed claim) ---');
      } catch (err) {
        console.error(err);
      }
    },
  },

  {
    name: 'Create a short-lived DIDT (1 second lifespan)',
    description: 'Useful for creating expired tokens.',
    args: [
      {
        name: 'Login Email',
        default: 'ian@fortmatic.com',
        fallbackGlobalStateKey: 'magicAuthEmail',
      },
    ],
    func: async (email: string) => {
      try {
        console.log(
          '--- Generating a short-lived DIDT (1 second lifespan) ---',
        );

        const m = getMagicInstance();
        await m.auth.loginWithMagicLink({ email });
        const token = await m.user.getIdToken({ lifespan: 1 });

        console.log('Short-lived DIDT:\n', token);
        console.log('Proof:\n', JSON.parse(atob(token))[0]);
        console.log('Claim (stringified):\n', JSON.parse(atob(token))[1]);
        console.log(
          'Claim (parsed):\n',
          JSON.parse(JSON.parse(atob(token))[1]),
        );

        console.log(
          '--- /Generating a short-lived DIDT (1 second lifespan) ---',
        );
      } catch (err) {
        console.error(err);
      }
    },
  },

  {
    name: 'Create an Invalid DIDT (Incorrect Signer)',
    args: [
      {
        name: 'Login Email',
        default: 'ian@fortmatic.com',
        fallbackGlobalStateKey: 'magicAuthEmail',
      },
    ],
    func: async (email: string) => {
      try {
        console.log('--- Generating an invalid DIDT (incorrect signer) ---');

        const m = getMagicInstance();
        await m.auth.loginWithMagicLink({ email });
        const token = await m.user.getIdToken({ lifespan: TEN_YEARS });

        const proof = JSON.parse(atob(token))[0];
        const claim = JSON.parse(JSON.parse(atob(token))[1]);
        const modifiedToken = btoa(
          JSON.stringify([
            proof,
            JSON.stringify({
              ...claim,
              iss: '"did:ethr:0x0000000000000000000000000000000000000000"',
            }),
          ]),
        );

        console.log('Invalid DIDT:\n', modifiedToken);
        console.log('Proof:\n', proof);
        console.log(
          'Claim (stringified):\n',
          JSON.parse(atob(modifiedToken))[1],
        );
        console.log(
          'Claim (parsed):\n',
          JSON.parse(JSON.parse(atob(modifiedToken))[1]),
        );

        console.log('--- /Generating an invalid DIDT (malformed claim) ---');
      } catch (err) {
        console.error(err);
      }
    },
  },
];
