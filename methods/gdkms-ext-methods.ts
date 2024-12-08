import { type MethodConfig } from '@/components/method-group/method-group';
import { Extensions } from '@/const/extensions';
import { getMagicInstance } from '@/lib/magic';
import { type GDKMSExtension } from '@magic-ext/gdkms';

export const groupName = Extensions.GDKMS;

export const methods: MethodConfig[] = [
  {
    name: 'gdkms.encryptWithPrivateKey(message)',
    description: 'Encrypt message',
    args: [{ name: 'message', default: 'Hello world' }],
    func: async (message: string) => {
      const ciphertext =
        await getMagicInstance<[GDKMSExtension]>().gdkms.encryptWithPrivateKey(
          message,
        );
      alert(`Encrypted: ${ciphertext}`);
    },
  },
  {
    name: 'gdkms.decryptWithPrivateKey(ciphertext)',
    description: 'Encrypt message',
    args: [{ name: 'message', default: 'Hello world' }],
    func: async (ciphertext: string) => {
      const originalMessage =
        await getMagicInstance<[GDKMSExtension]>().gdkms.decryptWithPrivateKey(
          ciphertext,
        );
      alert(`Decrypted: ${originalMessage}`);
    },
  },
];
