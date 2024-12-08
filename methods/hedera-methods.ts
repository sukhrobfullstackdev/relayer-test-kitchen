import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';
import { type HederaExtension } from '@magic-ext/hedera';

function uint8ArrayToBase64(uint8Array: any) {
  return btoa(String.fromCharCode.apply(null, uint8Array));
}
export const groupName = 'Hedera';

export const methods: MethodConfig[] = [
  {
    name: 'magic.hedera.getPublicKey',
    description: 'Returns public key of Hedera account',
    args: [],
    func: async () => {
      const magic = getMagicInstance<[HederaExtension]>();
      const { publicKeyDer } = await magic.hedera.getPublicKey();
      console.log('Public key:', publicKeyDer);
    },
  },
  {
    name: 'magic.hedera.sign',
    description: 'Signs a message with the hedera account',
    args: [{ name: 'message', default: 'hello world' }],
    func: async (message: string) => {
      const magic = getMagicInstance<[HederaExtension]>();
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(message);
      const sigUint8Array = await magic.hedera.sign(uint8Array);

      const base64String = uint8ArrayToBase64(sigUint8Array);
      console.log('Signature: ', base64String);
    },
  },
];
