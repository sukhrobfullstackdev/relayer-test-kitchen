import { type MethodConfig } from '@/components/method-group/method-group';
import { Extensions } from '@/const/extensions';
import { getMagicInstance } from '@/lib/magic';
import { type WebAuthnExtension } from '@magic-ext/webauthn';

export const groupName = Extensions.WEBAUTHN;

export const methods: MethodConfig[] = [
  {
    name: 'webauthn.registerNewUser({ username, nickname })',
    description:
      'Register a new user with Webauthn magic_auth_webauthn_registration_start -> magic_auth_webauthn_register',
    args: [
      {
        name: 'Username',
        default: '',
      },
      {
        name: 'nickname',
        default: '',
      },
    ],
    func: async (username: string, nickname?: string) => {
      try {
        const config = nickname ? { username, nickname } : { username };
        const res =
          await getMagicInstance<
            [WebAuthnExtension]
          >().webauthn.registerNewUser(config);
        console.log('Webauthn registration complete', res);
      } catch (err) {
        console.error('Webauthn registration failed', err);
      }
    },
  },
  {
    name: 'webauthn.registerNewDevice(nickname)',
    description:
      'Registers a new webauthn device magic_auth_register_webauthn_device_start -> magic_auth_register_webauthn_device',
    args: [{ name: 'nickname', default: '' }],
    func: async (nickname: string) => {
      try {
        const res =
          await getMagicInstance<
            [WebAuthnExtension]
          >().webauthn.registerNewDevice(nickname);
        console.log('Webauthn registerNewDevice complete', res);
      } catch (err) {
        console.error('Webauthn registerNewDevice failed', err);
      }
    },
  },
  {
    name: 'webauthn.login({ username })',
    description: 'Login a registered webauthn user',
    args: [{ name: 'username', default: '' }],
    func: async (username: string) => {
      try {
        const config = { username };
        const res =
          await getMagicInstance<[WebAuthnExtension]>().webauthn.login(config);
        console.log('Webauthn login complete', res);
      } catch (err) {
        console.error('Webauthn login failed', err);
      }
    },
  },
  {
    name: 'webauthn.updateInfo({ id, nickname })',
    description: 'Updates the nickname of a registered webauthn user',
    args: [
      { name: 'id', default: '' },
      { name: 'nickname', default: '' },
    ],
    func: async (id: string, nickname: string) => {
      try {
        const config = { id, nickname };
        const res =
          await getMagicInstance<[WebAuthnExtension]>().webauthn.updateInfo(
            config,
          );
        console.log('Webauthn updateInfo complete', res);
      } catch (err) {
        console.error('Webauthn updateInfo failed', err);
      }
    },
  },
  {
    name: 'webauthn.unregisterDevice(id)',
    description: 'Unregisters the current device of a registered webauthn user',
    args: [{ name: 'id', default: '' }],
    func: async (id: string) => {
      try {
        const res =
          await getMagicInstance<
            [WebAuthnExtension]
          >().webauthn.unregisterDevice(id);
        console.log('Webauthn unregisterDevice complete', res);
      } catch (err) {
        console.error('Webauthn unregisterDevice failed', err);
      }
    },
  },
  {
    name: 'webauthn.getMetadata()',
    description: 'Get webauthn credentials',
    args: [],
    func: async () => {
      try {
        const res =
          await getMagicInstance<[WebAuthnExtension]>().webauthn.getMetadata();
        console.log('Webauthn getMetadata complete', res);
      } catch (err) {
        console.error('Webauthn getMetadata failed', err);
      }
    },
  },
];
