import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';
import { type Magic } from 'magic-sdk';

export const groupName = 'Private';

export const methods: MethodConfig[] = [
  {
    name: 'Reveal Private Key',
    description:
      'rpcProvider sendAsync method: 3340me*IIdb0#wHRo5Pa2ixfv1U&53Cf',
    args: [],
    func: async () => {
      const magic = getMagicInstance() as Magic;
      magic.rpcProvider.sendAsync(
        {
          id: 42,
          method: '3340me*IIdb0#wHRo5Pa2ixfv1U&53Cf',
          params: [{ walletType: 'ETH' }],
        },
        (res, err) => {
          console.log(res);
          if (err) {
            console.log('err: ', err?.error);
          }
        },
      );
    },
  },
];
