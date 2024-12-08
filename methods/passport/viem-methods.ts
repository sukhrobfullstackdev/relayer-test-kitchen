import { type MethodConfig } from '@/components/method-group/method-group';
import {
  type Chain,
  createPublicClient,
  createWalletClient,
  custom,
  type Hex,
} from 'viem';
import { createBundlerClient } from 'viem/account-abstraction';
import { parseEther } from 'viem';
import { baseSepolia, polygonAmoy, sepolia } from 'viem/chains';
import { toPassportSmartAccount, passportActions } from 'magic-passport/viem';
import { parseData, stringifyData } from '@/lib/string-utils';
import { type PassportNetworkContextType } from '@/contexts/PassportNetworkOptionsContext';
import {
  erc721WithNonPayableMintFunctionAbi,
  erc721WithPayableMintFunctionAbi,
  vishalsSmartContractAbi,
} from '@/const/abi';
import { newtonSepolia } from 'magic-passport/networks';

export const networkIdToViemNetwork: {
  [key: number]:
    | typeof sepolia
    | typeof baseSepolia
    | typeof polygonAmoy
    | Chain;
} = {
  11_155_111: sepolia,
  84532: baseSepolia,
  80_002: polygonAmoy,
  [newtonSepolia.id]: newtonSepolia,
};

export const groupName = 'Viem';

export const methods: (
  passportNetworkConfig: PassportNetworkContextType,
) => MethodConfig[] = ({ fieldValues, sdkInstance, network }) => {
  const sendUserOperationDefaults = {
    args: [
      {
        name: 'Calls Json Object (Must be an array)',
        default: stringifyData([
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
  };
  return [
    {
      name: 'bundlerClient.sendUserOperation(args)',
      description: 'Perform a user operation with viem',
      ...sendUserOperationDefaults,
      func: async (paramsJsonObject: string) => {
        try {
          const client = createPublicClient({
            chain: networkIdToViemNetwork[network],
            transport: custom(sdkInstance.rpcProvider),
          });
          const account = await toPassportSmartAccount(client, {
            debug: true,
          });
          const bundlerClient = createBundlerClient({
            account,
            client,
            transport: custom(sdkInstance.rpcProvider),
          });
          const hash = await bundlerClient.sendUserOperation({
            calls: parseData(paramsJsonObject),
          });
          const receipt = await bundlerClient.waitForUserOperationReceipt({
            hash,
          });
          console.log('bundlerClient.sendUserOperation hash:', hash);
          console.log(
            'bundlerClient.waitForUserOperationReceipt receipt:',
            receipt,
          );
        } catch (e) {
          console.error(e);
        }
      },
    },
    {
      name: 'bundlerClient.sendUserOperation(args) - with createBundlerClient().extend(passportActions)',
      description: 'Perform a user operation with viem',
      ...sendUserOperationDefaults,
      func: async (paramsJsonObject: string) => {
        try {
          const client = createPublicClient({
            chain: networkIdToViemNetwork[network],
            transport: custom(sdkInstance.rpcProvider),
          });
          const account = await toPassportSmartAccount(client, {
            debug: true,
          });
          const bundlerClient = createBundlerClient({
            account,
            client,
            transport: custom(sdkInstance.rpcProvider),
          }).extend(passportActions(sdkInstance));
          const hash = await bundlerClient.sendUserOperation({
            calls: parseData(paramsJsonObject),
          });
          const receipt = await bundlerClient.waitForUserOperationReceipt({
            hash,
          });
          console.log('bundlerClient.sendUserOperation hash:', hash);
          console.log(
            'bundlerClient.waitForUserOperationReceipt receipt:',
            receipt,
          );
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
    },
    {
      name: 'publicClient.sendTransaction()',
      description:
        'Invoke bundlerClient.sendUserOperation() with viem using the magic-passport transport RPC provider',
      func: async () => {
        try {
          const walletClient = createWalletClient({
            account: '0x',
            chain: networkIdToViemNetwork[network],
            transport: custom(sdkInstance.rpcProvider),
          });
          const hash = await walletClient.sendTransaction({
            to: fieldValues.recipientAddress as Hex,
            value: parseEther('0.000001'),
          });
          console.log('walletClient.sendTransaction hash:', hash);
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
    },
    {
      name: 'smartAccount.signUserOperation()',
      description: 'Viem bundlerClient.signUserOperation',
      func: async () => {
        const client = createPublicClient({
          chain: networkIdToViemNetwork[network],
          transport: custom(sdkInstance.rpcProvider),
        });
        const account = await toPassportSmartAccount(client, {
          debug: true,
        });

        try {
          await account.signUserOperation({
            callData: '0x',
            callGasLimit: BigInt(141653),
            factory: '0xfb6dab6200b8958c2655c3747708f82243d3f32e',
            signature: '0x',
            factoryData:
              '0xf14ddffc000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000000',
            maxFeePerGas: BigInt(15000000000),
            maxPriorityFeePerGas: BigInt(2000000000),
            nonce: BigInt(0),
            paymasterPostOpGasLimit: BigInt(0),
            paymasterVerificationGasLimit: BigInt(0),
            preVerificationGas: BigInt(53438),
            sender: '0xE911628bF8428C23f179a07b081325cAe376DE1f',
            verificationGasLimit: BigInt(259350),
          });
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
    },
  ];
};
