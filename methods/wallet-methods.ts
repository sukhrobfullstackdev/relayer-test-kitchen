import { getMagicInstance } from '@/lib/magic';
import { setUser } from '@/store/config-slice';
import store from '@/store/store';
import { Contract, Typed, ethers } from 'ethers';
import { type MethodConfig } from '../components/method-group/method-group';

export const groupName = 'Wallet';
export const methods: MethodConfig[] = [
  {
    name: 'wallet.connectWithUI()',
    description: 'Logs the user in with login form UI',
    args: [],
    func: async () => {
      try {
        const handle = getMagicInstance().wallet.connectWithUI();
        handle.on('id-token-created', (params: { idToken: string }) => {
          // Remember to allowlist the domain, otherwise idToken will not be generated
          console.log('id-token', params.idToken);
        });
        const res = await handle;
        console.log(res);
      } catch (error) {
        console.log('Connect with UI: ', error);
      }
    },
  },
  {
    name: 'wallet.showUI()',
    description: 'Display the wallet view to the user',
    args: [],
    func: async () => {
      try {
        getMagicInstance()
          .wallet.showUI()
          .on('disconnect' as any, () => {
            console.log('user logged out');
          })
          .then((res) => {
            console.log('res from showUI:', res);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log('Show wallet error: ', error);
      }
    },
  },
  {
    name: 'wallet.showAddress()',
    description: 'Display the wallet address to the user',
    args: [],
    func: async () => {
      try {
        await getMagicInstance().wallet.showAddress();
        console.log('showed the wallet address!');
      } catch (error) {
        console.log('Show wallet address error: ', error);
      }
    },
  },
  {
    name: 'wallet.showSendTokensUI()',
    description: 'Display the wallet address to the user',
    args: [],
    func: async () => {
      try {
        await getMagicInstance().wallet.showSendTokensUI();
        console.log('showed send tokens page!');
      } catch (error) {
        console.log('Show send tokens page error: ', error);
      }
    },
  },
  {
    name: 'wallet.showNFTs()',
    description: 'Display the wallet address to the user',
    args: [],
    func: async () => {
      try {
        await getMagicInstance().wallet.showNFTs();
        console.log('successfully showed the NFTs');
      } catch (error) {
        console.log('Show the nfts page error: ', error);
      }
    },
  },

  {
    name: 'wallet.showOnRamp()',
    description: 'Display the fiat onramp selection screen to the user',
    args: [],
    func: async () => {
      try {
        await getMagicInstance().wallet.showOnRamp();
        console.log('showed fiat onramp UI!');
      } catch (error) {
        console.log('Show fiat onramp error: ', error);
      }
    },
  },

  {
    name: 'wallet.showBalances()',
    description: 'Display the wallet address to the user',
    args: [],
    func: async () => {
      try {
        await getMagicInstance().wallet.showBalances();
        console.log('showed fiat onramp UI!');
      } catch (error) {
        console.log('Show token balances page error: ', error);
      }
    },
  },

  {
    name: 'wallet.requestUserInfoWithUI() [DEPRECATING]',
    description:
      'Display a prompt to request user information. Limited to email at this time.',
    args: [{ name: 'isResponseRequired', default: true }],
    func: async (_isResponseRequired: boolean) => {
      try {
        const userInfo =
          (await getMagicInstance().wallet.requestUserInfoWithUI()) as any;
        console.log('Request User Information', userInfo);
        alert(`Request User Information ${userInfo.email}`);
      } catch (error) {
        console.log('Request user information error: ', error);
      }
    },
  },

  {
    name: 'wallet.getInfo() [DEPRECATING]',
    description: 'Get wallet info for logged in user.',
    args: [],
    func: async () => {
      try {
        const walletInfo = (await getMagicInstance().wallet.getInfo()) as any;
        alert(JSON.stringify(walletInfo));
      } catch (error) {
        console.log('Wallet info error: ', error);
      }
    },
  },

  {
    name: 'wallet.disconnect() [DEPRECATING]',
    description: 'Ends the current session',
    args: [],
    func: async () => {
      try {
        await getMagicInstance().wallet.disconnect();
        store.dispatch(setUser(null));
        console.info('Disconnect succeeded');
      } catch (error) {
        console.error('Disconnect error: ', error);
      }
    },
  },

  {
    name: 'wallet.sendGaslessTransaction()',
    description: 'Amoy only',
    args: [
      {
        name: 'contractAddress',
        default: '0x429633AdeA9316A132206e0443E11aB0D94ddE2b',
      },
      {
        name: 'message',
        default: 'Hello World',
      },
    ],
    func: async (contractAddress: string, message: string) => {
      const userInfo = await getMagicInstance().user.getInfo();
      if (!userInfo.publicAddress) {
        throw new Error('No public address found');
      }

      const magic = getMagicInstance();
      const provider = magic.rpcProvider;

      const web3Provider = new ethers.BrowserProvider(provider);
      const destinationContract = new Contract(
        contractAddress,
        [
          {
            inputs: [
              {
                internalType: 'string',
                name: 'newMessage',
                type: 'string',
              },
            ],
            name: 'setMessage',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        web3Provider,
      );

      const transaction =
        await destinationContract.setMessage.populateTransaction(
          Typed.string(message),
        );

      const response = await magic.wallet.sendGaslessTransaction(
        userInfo.publicAddress,
        transaction,
      );
      console.log({ response });
    },
  },
];
