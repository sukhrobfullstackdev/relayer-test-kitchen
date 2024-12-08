import { type MethodConfig } from '@/components/method-group/method-group';
import { type PassportNetworkContextType } from '@/contexts/PassportNetworkOptionsContext';
import { parseEther, hashMessage, createPublicClient, http } from 'viem';
import {
  erc721WithNonPayableMintFunctionAbi,
  erc721WithPayableMintFunctionAbi,
  vishalsSmartContractAbi,
} from '@/const/abi';
import { parseData, stringifyData } from '@/lib/string-utils';
import { verifyEIP6492Signature } from '@zerodev/sdk';
import { sepolia } from 'viem/chains';

export const groupName = 'Basic';

export const methods: (
  passportNetworkConfig: PassportNetworkContextType,
) => MethodConfig[] = ({ sdkInstance, fieldValues, network }) => [
  {
    name: 'magicPassport.connect()',
    description:
      'Open the pop-up and connect to the app corresponding to the public api key provided.',
    func: async () => {
      try {
        const res = await sdkInstance.user.connect();
        console.log('res: ', res);
      } catch (err) {
        console.log('error: ', err);
      }
    },
  },
  {
    name: 'magicPassport.isConnected()',
    description: 'Check if valid idToken exist.',
    func: async () => {
      try {
        const res = await sdkInstance.user.isConnected();
        console.log('res: ', res);
      } catch (err) {
        console.log('error: ', err);
      }
    },
  },
  {
    name: 'magicPassport.getConnectedProfile()',
    description: 'Return connected profile from the idToken if one exist.',
    func: async () => {
      try {
        const res = await sdkInstance.user.getConnectedProfile();
        console.log('res: ', res);
      } catch (err) {
        console.log('error: ', err);
      }
    },
  },
  {
    name: 'magicPassport.disconnect()',
    description: 'Remove idToken from the local storage.',
    func: async () => {
      try {
        // const passport = getPassportInstance();
        // const res = await passport.user.disconnect();
        // console.log('res: ', res);
        console.log('implement me');
      } catch (err) {
        console.log('error: ', err);
      }
    },
  },
  {
    name: 'magicPassport.wallet.showUI()',
    description: 'Display the wallet view to the user.',
    func: async () => {
      try {
        const res = await sdkInstance.wallet.showUI();
        console.log('res: ', res);
      } catch (err) {
        console.log('error: ', err);
      }
    },
  },
  {
    name: 'magicPassport.wallet.personalSign(string)',
    description: 'ETH_SEPOLIA ONLY - Sign a message.',
    func: async () => {
      try {
        const siweMessage = `example.com wants you to sign in with your Ethereum account:
        0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

        Sign in with Ethereum to this application.

        URI: https://example.com
        Version: 1
        Chain ID: 1
        Nonce: 32891756
        Issued At: 2024-03-20T15:27:00.000Z`;
        const signature = await sdkInstance.wallet.personalSign(siweMessage);
        console.log('signature: ', signature);

        // Verifying signature
        const { publicAddress } = await sdkInstance.user.getConnectedProfile();
        const client = createPublicClient({
          chain: sepolia,
          transport: http('https://rpc.sepolia.org'),
        });
        const isValidSignature = await verifyEIP6492Signature({
          signer: publicAddress,
          hash: hashMessage(siweMessage),
          signature: signature as `0x${string}`,
          client,
        });
        console.log('isValidSignature:', isValidSignature);
      } catch (err) {
        console.log('error: ', err);
      }
    },
  },
  {
    name: 'magicPassport.wallet.sendUserOperation()',
    description: 'Perform a user operation.',
    args: [
      {
        name: 'Calls Json Object (Must be an array)',
        default: `[\n{"to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",\n"value": "0x38d7ea4c68000"}\n]`,
        type: 'json',
      },
    ],
    defaultPresets: [
      {
        name: 'Mint NFT with Native Gas Token (0.000001)',
        values: [
          stringifyData([
            {
              to: fieldValues.payableNFTAddress, // replace with a real contract address
              args: [
                fieldValues.recipientAddress,
                Math.ceil(Math.random() * 1000000),
              ],
              functionName: 'mint',
              abi: erc721WithPayableMintFunctionAbi,
              value: parseEther('0.000001'),
            },
          ]),
        ],
      },
      {
        name: 'Native Token Transfer (0.000001)',
        values: [
          stringifyData([
            {
              to: fieldValues.recipientAddress,
              value: parseEther('0.000001'),
            },
          ]),
        ],
      },
      {
        name: 'Generic Contract Call (Vishals storage contract)',
        values: [
          stringifyData([
            {
              to: fieldValues.vishalStorageContractAddress as `0x${string}`,
              functionName: 'store',
              abi: vishalsSmartContractAbi,
              args: [4],
            },
          ]),
        ],
      },
      {
        name: 'Free Mint NFT',
        values: [
          stringifyData([
            {
              to: fieldValues.nonPayableNFTAddress, // replace with a real contract address
              args: [
                fieldValues.recipientAddress,
                Math.ceil(Math.random() * 1000000),
              ],
              functionName: 'mint',
              abi: erc721WithNonPayableMintFunctionAbi,
            },
          ]),
        ],
      },
    ],
    func: async (paramsJsonObject: string) => {
      try {
        const userOperationHash = await sdkInstance.wallet.sendUserOperation({
          calls: parseData(paramsJsonObject),
        });
        console.log(
          'MagicPassportSDK > wallet > sendUserOperation: ',
          userOperationHash,
        );
      } catch (err) {
        console.log('error: ', err);
        throw err;
      }
    },
  },
];
