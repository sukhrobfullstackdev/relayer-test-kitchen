/* eslint-disable import/no-extraneous-dependencies */

import sigUtil from 'eth-sig-util';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { ethers } from 'ethers';
import Web3 from 'web3';

import { type MethodConfig } from '@/components/method-group/method-group';
import {
  LargeSignTypedDataV3Payload,
  LargeSignTypedDataV4Payload,
  SmallSignTypedDataV3Payload,
  SmallSignTypedDataV4Payload,
  signTypedDataV1Payload,
} from '@/const/sign-typed-data-payloads';
import { getMagicInstance } from '@/lib/magic';
import { compareAddresses } from '@/lib/web3-utils';
import { type JsonRpcResponsePayload } from 'magic-sdk';

const recoverAndValidateSignature = (
  signingResponse: JsonRpcResponsePayload | null | undefined,
  payloadData: any,
  publicAddress: string,
  signatureType: string,
) => {
  console.log(`signature: ${signingResponse?.result}`);
  const recoveryData = { data: payloadData, sig: signingResponse?.result };
  let recoveryFunction;
  switch (signatureType) {
    case 'Personal':
      recoveryFunction = (sigUtil as any).recoverPersonalSignature;
      break;
    case 'V3':
      recoveryFunction = (sigUtil as any).recoverTypedSignature;
      break;
    case 'V4':
    default:
      recoveryFunction = (sigUtil as any).recoverTypedSignature_v4;
  }
  const recovered = recoveryFunction(recoveryData);
  console.log('Recovered address:', recovered);
  console.log(
    compareAddresses([recovered, publicAddress])
      ? 'Signing success!'
      : 'Signing failed!',
  );
};

export const groupName = 'EVM Web3';

export const methods: MethodConfig[] = [
  {
    name: 'Request Accounts [LOGIN FORM]',
    description: 'web3.eth.requestAccounts()',
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      provider
        .send('eth_requestAccounts', [])
        .then(console.log)
        .catch(console.error);
    },
  },
  {
    name: '[provider] Get list of accounts',
    description: `provider.listAccounts()`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const accounts = await provider.listAccounts();
        console.log(
          'accounts',
          accounts.map((item: { address: string }) => item.address),
        );
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[provider] Get balance',
    description: `provider.getBalance()`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0];

        const balance = await provider.getBalance(publicAddress);
        console.log('balance', balance);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[provider] Get network',
    description: `provider.getNetwork()`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const network = await provider.getNetwork();

        console.log('network', network);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[provider] Get Net Version',
    description: `net_version`,
    func: async () => {
      try {
        const res = await getMagicInstance().rpcProvider.request({
          id: '1',
          method: 'net_version',
          params: [],
        });

        console.log('net_version', res);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[provider] Get fee data',
    description: `provider.getFeeData()`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const gasPrice = await provider.getFeeData();
        console.log('gasPrice', gasPrice);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[provider] Get estimated gas',
    description: `provider.estimateGas() ⚠️ transaction: sending 0.000001 token to myself`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0];

        const txnParams = {
          from: publicAddress,
          to: publicAddress,
          value: ethers.parseUnits('0.000001', 'ether'),
          gasLimit: 100000,
        };

        const estimatedGas = await provider.estimateGas(txnParams);
        console.log('estimatedGas', estimatedGas);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[provider] Get transaction count',
    description: `provider.getTransactionCount()`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const transactionCount =
          await provider.getTransactionCount(publicAddress);
        console.log('transactionCount', transactionCount);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[provider] Get block number',
    description: `provider.getBlockNumber()`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const blockNumber = await provider.getBlockNumber();

        console.log('blockNumber', blockNumber);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    // https://github.com/ethers-io/ethers.js/issues/892#issuecomment-828881945
    name: '[provider] Batch Request ⚠️ Sepolia only',
    description:
      'In ethers.js v6, the normal JsonRpcProvider has batching built-in.',
    func: async () => {
      // https://github.com/ethers-io/ethers.js/issues/2771#issuecomment-1062075680
      const batchProvider = new ethers.JsonRpcProvider(
        'https://sepolia.infura.io/v3/23131c7335bc4a7e8c896624f61fad40',
      );

      // Begin queuing...
      const promiseA = batchProvider.getBlockNumber();
      const promiseB = batchProvider.getFeeData();

      // This line won't finish until both A and B are complete, and both A and B are sent as a batch
      const [blockNumber, gasPrice] = await Promise.all([promiseA, promiseB]);

      console.log('blockNumber', blockNumber, 'gasPrice', gasPrice);
    },
  },
  {
    name: '[signer] Get nonce',
    description: `provider.signer() -> signer().getNonce()`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const signer = await provider.getSigner();
        const nonce = await signer.getNonce();

        console.log('nonce', nonce);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[signer] Populate transaction',
    description: `provider.signer() -> signer().populateTransaction() ⚠️ transaction: sending 0.00001 token to myself`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const txnParams = {
          from: publicAddress,
          to: publicAddress,
          value: ethers.parseUnits('0.00001', 'ether'),
          gasLimit: 21000,
        };

        const signer = await provider.getSigner();
        const populatedTransaction =
          await signer.populateTransaction(txnParams);

        console.log('populatedTransaction', populatedTransaction);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[signer] Sign transaction',
    description: `provider.signer() -> signer().signTransaction() ⚠️ transaction: sending 0.00001 token to myself`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const txnParams = {
          from: publicAddress,
          to: publicAddress,
          value: ethers.parseUnits('0.00001', 'ether'),
          gasLimit: 21000,
        };

        const signer = await provider.getSigner();
        const signedTransaction = await signer.signTransaction(txnParams);

        console.log('signedTransaction', signedTransaction);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[signer] Sign message ⭐️ EIP-191',
    description: `provider.signer() -> signer().signMessage()`,
    args: [{ name: 'message', default: 'Hello Magic' }],
    func: async (message: string) => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const signer = await provider.getSigner();
        const signedMessage = await signer.signMessage(message);

        console.log('signedMessage', signedMessage);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[signer] Sign typed data ⭐️ EIP-712',
    description: `provider.signer() -> signer().signTypedData() ⚠️ transaction: "Hello, Bob!" message`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const signer = await provider.getSigner();

        // https://ethereum.stackexchange.com/questions/151782/how-to-resolve-ambiguous-primary-types-or-unused-types-error-with-typeddataen
        // eslint-disable-next-line  @typescript-eslint/naming-convention
        const { EIP712Domain: _omitted, ...rest } =
          SmallSignTypedDataV4Payload.types;

        const signedTypedData = await signer.signTypedData(
          SmallSignTypedDataV4Payload.domain,
          rest,
          SmallSignTypedDataV4Payload.message,
        );

        console.log('signedTypedData', signedTypedData);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[signer] Send transaction to destination address ⭐️',
    description: `provider.signer() -> signer().sendTransaction()`,
    args: [
      { name: 'amount', default: '0.00001' },
      {
        name: 'gasLimit',
        default: '21000',
      },
      { name: 'toAddress', default: '0x0' },
    ],
    func: async (amount: string, gasLimit: string, toAddress: string) => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;
        console.log('accounts', publicAddress);

        const txnParams = {
          from: publicAddress,
          to: toAddress,
          value: ethers.parseUnits(amount, 'ether'),
          gasLimit: ethers.toNumber(gasLimit),
        };

        const signer = await provider.getSigner();
        const transactionResponse = await signer.sendTransaction(txnParams);
        console.log('transactionResponse', transactionResponse);

        const tx = await provider.getTransaction(transactionResponse.hash);
        const receipt = await tx?.wait();
        console.log('receipt', receipt);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[signer] Send transaction',
    description: `provider.signer() -> signer().sendTransaction() ⚠️ transaction: sending tokens to myself`,
    args: [
      { name: 'amount', default: '0.00001' },
      {
        name: 'gasLimit',
        default: '21000',
      },
    ],
    func: async (amount: string, gasLimit: string) => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;
        console.log('accounts', publicAddress);

        const txnParams = {
          from: publicAddress,
          to: publicAddress,
          value: ethers.parseUnits(amount, 'ether'),
          gasLimit: ethers.toNumber(gasLimit),
        };

        const signer = await provider.getSigner();
        const transactionResponse = await signer.sendTransaction(txnParams);
        console.log('transactionResponse', transactionResponse);

        const tx = await provider.getTransaction(transactionResponse.hash);
        console.log('getTransaction', tx);
        const receipt = await tx?.wait();
        console.log('receipt', receipt);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[signer] Send transaction ⭐️ Type-2',
    description: `provider.signer() -> signer().sendTransaction() ⚠️ transaction: sending tokens to myself`,
    args: [
      { name: 'amount', default: '0.00001' },
      {
        name: 'gasLimit',
        default: '21000',
      },
    ],
    func: async (amount: string, gasLimit: string) => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;
        console.log('accounts', publicAddress);

        const feeData = await provider.getFeeData();

        const txnParams = {
          from: publicAddress,
          to: publicAddress,
          value: ethers.parseUnits(amount, 'ether'),
          gasLimit: ethers.toNumber(gasLimit),
          maxFeePerGas: feeData.maxFeePerGas,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        };

        const signer = await provider.getSigner();
        const transactionResponse = await signer.sendTransaction(txnParams);
        console.log('transactionResponse', transactionResponse);

        const tx = await provider.getTransaction(transactionResponse.hash);
        const receipt = await tx?.wait();
        console.log('receipt', receipt);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[signer] Send transaction ⭐️ Type-0',
    description: `provider.signer() -> signer().sendTransaction() ⚠️ transaction: sending tokens to myself`,
    args: [
      { name: 'amount', default: '0.00001' },
      {
        name: 'gasLimit',
        default: '21000',
      },
    ],
    func: async (amount: string, gasLimit: string) => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;
        console.log('accounts', publicAddress);

        const feeData = await provider.getFeeData();

        const txnParams = {
          from: publicAddress,
          to: publicAddress,
          value: ethers.parseUnits(amount, 'ether'),
          gasLimit: ethers.toNumber(gasLimit),
          gasPrice: feeData.gasPrice,
        };

        const signer = await provider.getSigner();
        const transactionResponse = await signer.sendTransaction(txnParams);
        console.log('transactionResponse', transactionResponse);

        const tx = await provider.getTransaction(transactionResponse.hash);
        const receipt = await tx?.wait();
        console.log('receipt', receipt);
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    // Default Address is LINK on Sepolia - faucet: https://faucets.chain.link/
    name: '[contract] Send ERC20 tokens ⚠️ Sepolia only',
    args: [
      { name: 'Amount', default: '0' },
      {
        name: 'ERC20 Token Address',
        default: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
      },
      { name: 'Decimals', default: '18' },
    ],
    description: 'provider.listAccounts() -> contract.methods.transfer',
    func: async (amount: string, contractAddress: string, decimals: string) => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      const signer = await provider.getSigner();
      const abi: any = [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'transfer',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ];
      const tokenInstance = new ethers.Contract(contractAddress, abi, signer);
      const publicAddress = (await provider.listAccounts())[0].address;
      const ethDecimalsToUnit = {
        18: 'ether',
        15: 'finney',
        12: 'micro',
        9: 'gwei',
        6: 'mwei',
        3: 'kwei',
        1: 'wei',
      };
      try {
        const tx = await tokenInstance.transfer(
          publicAddress,
          ethers.parseUnits(
            amount,
            (ethDecimalsToUnit as any)[Number(decimals)] || 'ether',
          ),
        );
        console.log('the txn hash that was returned to the sdk:', tx.hash);
        const receipt = await tx.wait();
        console.log('the txn receipt that was returned to the sdk:', receipt);
      } catch (error) {
        console.log(error);
      }
    },
  },
  {
    /**
     * Contract code is available on Etherscan (goerli)
     * https://goerli.etherscan.io/address/0x1Bf9f98A06eE225E818dDC591A9Cb0B9279B83a3#code
     */
    name: '[contract] Smart Contract Transaction ⚠️ Sepolia only',
    description: 'provider.listAccounts() -> contract.methods.store().send()',
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      const signer = await provider.getSigner();
      const abi = [
        {
          inputs: [],
          name: 'retrieve',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'num',
              type: 'uint256',
            },
          ],
          name: 'store',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ];
      const contractAddress = '0x30a932c133713fbd5373b22a02cd9899c4f291d6';
      const contract = new ethers.Contract(contractAddress, abi as any, signer);
      try {
        const tx = await contract.store(999);
        console.log('the txn hash that was returned to the sdk:', tx.hash);
        const receipt = await tx.wait();
        console.log('the txn receipt that was returned to the sdk:', receipt);
      } catch (error) {
        console.log(error);
      }
    },
  },
  {
    name: '[contract] Deploy a contract',
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      const signer = await provider.getSigner();

      const contractAbi = [
        {
          inputs: [],
          name: 'retrieve',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'num',
              type: 'uint256',
            },
          ],
          name: 'store',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ];

      const contractBytecode =
        '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220322c78243e61b783558509c9cc22cb8493dde6925aa5e89a08cdf6e22f279ef164736f6c63430008120033';

      const factory = new ethers.ContractFactory(
        contractAbi as any,
        contractBytecode,
        signer,
      );

      try {
        const contract = await factory.deploy();
        const tx = contract.deploymentTransaction();

        console.log('the txn hash that was returned to the sdk:', tx?.hash);
        const deployed = await contract.waitForDeployment();
        const contractAddress = await deployed.getAddress();

        console.log('Deployed Contract Address : ', contractAddress);
      } catch (error) {
        console.log(error);
      }
    },
  },
  {
    name: '[magic-rpc] SignTypedDataV4 (JSON Obj, Under Truncation Limit)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'eth_signTypedData_v4' })`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );

      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const payload = {
          id: 1,
          method: 'eth_signTypedData_v4',
          params: [publicAddress, SmallSignTypedDataV4Payload],
        };
        getMagicInstance().rpcProvider.sendAsync(payload, (err, response) => {
          if (err) return console.error(err);
          recoverAndValidateSignature(
            response,
            SmallSignTypedDataV4Payload,
            publicAddress,
            'V4',
          );
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[magic-rpc] SignTypedDataV4 (JSON Obj, Over Truncation Limit)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'eth_signTypedData_v4' })`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const payload = {
          id: 1,
          method: 'eth_signTypedData_v4',
          params: [publicAddress, LargeSignTypedDataV4Payload],
        };
        getMagicInstance().rpcProvider.sendAsync(payload, (err, response) => {
          if (err) return console.error(err);
          recoverAndValidateSignature(
            response,
            LargeSignTypedDataV4Payload,
            publicAddress,
            'V4',
          );
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[magic-rpc] SignTypedDataV4 (JSON Obj String, Under Truncation Limit)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'eth_signTypedData_v4' })`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const payload = {
          id: 1,
          method: 'eth_signTypedData_v4',
          params: [publicAddress, JSON.stringify(SmallSignTypedDataV4Payload)],
        };
        getMagicInstance().rpcProvider.sendAsync(payload, (err, response) => {
          if (err) return console.error(err);
          recoverAndValidateSignature(
            response,
            SmallSignTypedDataV4Payload,
            publicAddress,
            'V4',
          );
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[magic-rpc] SignTypedDataV4 (JSON Obj String, Over Truncation Limit)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'eth_signTypedData_v4' })`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const payload = {
          id: 1,
          method: 'eth_signTypedData_v4',
          params: [publicAddress, JSON.stringify(LargeSignTypedDataV4Payload)],
        };
        getMagicInstance().rpcProvider.sendAsync(payload, (err, response) => {
          if (err) return console.error(err);
          recoverAndValidateSignature(
            response,
            LargeSignTypedDataV4Payload,
            publicAddress,
            'V4',
          );
        });
      } catch (err) {
        console.error(err);
      }
    },
  },

  {
    name: '[magic-rpc] SignTypedDataV3 (JSON Obj, Under Truncation Limit)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'eth_signTypedData_v3' })`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const payload = {
          id: 1,
          method: 'eth_signTypedData_v3',
          params: [publicAddress, SmallSignTypedDataV3Payload],
        };
        getMagicInstance().rpcProvider.sendAsync(payload, (err, response) => {
          if (err) return console.error(err);
          recoverAndValidateSignature(
            response,
            SmallSignTypedDataV3Payload,
            publicAddress,
            'V3',
          );
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[magic-rpc] SignTypedDataV3 (JSON Obj, Over Truncation Limit)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'eth_signTypedData_v3' })`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const payload = {
          id: 1,
          method: 'eth_signTypedData_v3',
          params: [publicAddress, LargeSignTypedDataV3Payload],
        };
        getMagicInstance().rpcProvider.sendAsync(payload, (err, response) => {
          if (err) return console.error(err);
          recoverAndValidateSignature(
            response,
            LargeSignTypedDataV3Payload,
            publicAddress,
            'V3',
          );
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[magic-rpc] SignTypedDataV3 (JSON Obj String, Under Truncation Limit)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'eth_signTypedData_v3' })`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const payload = {
          id: 1,
          method: 'eth_signTypedData_v3',
          params: [publicAddress, JSON.stringify(SmallSignTypedDataV3Payload)],
        };
        getMagicInstance().rpcProvider.sendAsync(payload, (err, response) => {
          if (err) return console.error(err);
          recoverAndValidateSignature(
            response,
            SmallSignTypedDataV3Payload,
            publicAddress,
            'V3',
          );
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[magic-rpc] SignTypedDataV3 (JSON Obj String, Over Truncation Limit)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'eth_signTypedData_v3' })`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const payload = {
          id: 1,
          method: 'eth_signTypedData_v3',
          params: [publicAddress, JSON.stringify(LargeSignTypedDataV3Payload)],
        };
        getMagicInstance().rpcProvider.sendAsync(payload, (err, response) => {
          if (err) return console.error(err);
          recoverAndValidateSignature(
            response,
            LargeSignTypedDataV3Payload,
            publicAddress,
            'V3',
          );
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
  {
    name: '[magic-rpc] PersonalSign (Under Truncation Limit)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'personal_sign' })`,
    func: async () => {
      // const text =
      //   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
      const text = 'food is yummy';
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      const accounts = await provider.listAccounts();
      const publicAddress = accounts[0].address || '';

      const payload = {
        // jsonrpc: '2.0',
        id: 1,
        method: 'personal_sign',
        params: [text, publicAddress],
      };
      getMagicInstance().rpcProvider.sendAsync(payload as any, (err, res) => {
        if (err) return console.error(err);
        recoverAndValidateSignature(
          res,
          ethers.hexlify(Buffer.from(text, 'utf8')),
          publicAddress,
          'Personal',
        );
      });
    },
  },
  {
    name: '[magic-rpc] PersonalSign (Over Truncation Limit)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'personal_sign' })`,
    func: async () => {
      const text =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      const accounts = await provider.listAccounts();
      const publicAddress = accounts[0].address;

      const payload = {
        // jsonrpc: '2.0',
        id: 1,
        method: 'personal_sign',
        params: [text, publicAddress],
      };
      getMagicInstance().rpcProvider.sendAsync(payload as any, (err, res) => {
        if (err) return console.error(err);
        recoverAndValidateSignature(
          res,
          ethers.hexlify(Buffer.from(text, 'utf8')),
          publicAddress,
          'Personal',
        );
      });
    },
  },
  {
    name: '[magic-rpc] Eth Sign',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'eth_sign' })`,
    args: [
      {
        name: 'message to sign',
        default: 'hello world',
      },
    ],
    func: async (messageToSign: string) => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      const accounts = await provider.listAccounts();
      const publicAddress = accounts[0].address;

      const payload = {
        id: 1,
        method: 'eth_sign',
        params: [publicAddress, messageToSign],
      };

      getMagicInstance().rpcProvider.sendAsync(payload, (err, res) => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        if (err) throw err;
        recoverAndValidateSignature(
          res,
          ethers.hexlify(Buffer.from(messageToSign, 'utf8')),
          publicAddress,
          'Personal',
        );
      });
    },
  },

  {
    name: '[magic-rpc] Eth Sign - Web3 v1.xx',
    description: `[eth_sign] web3.eth.getAccounts() -> web3.eth.sign()`,
    args: [
      {
        name: 'message to sign',
        default: 'hello world',
      },
    ],
    func: async (messageToSign: string) => {
      const web3 = new Web3(getMagicInstance().rpcProvider);
      const accounts = await web3.eth.getAccounts();
      const publicAddress = accounts[0];
      const res = await web3.eth.sign(messageToSign, publicAddress);
      console.log(`signature: ${res}`);
    },
  },

  {
    name: '[magic-rpc] Sign Typed Data (Legacy)',
    description: `provider.listAccounts() -> rpcProvider.sendAsync({ method: 'eth_signTypedData' })`,
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      try {
        const accounts = await provider.listAccounts();
        const publicAddress = accounts[0].address;

        const payload = {
          id: 1,
          method: 'eth_signTypedData',
          params: [signTypedDataV1Payload, publicAddress],
        };
        const data: any = {
          data: signTypedDataV1Payload,
        };

        getMagicInstance().rpcProvider.sendAsync(payload, (err, response) => {
          if (err) {
            console.error(err);
            return;
          }

          console.log(response, accounts);
          data.sig = response?.result;

          const recovered = sigUtil.recoverTypedSignatureLegacy(data);
          console.log('Recovered address:', recovered.toLowerCase());
          console.log(
            compareAddresses([recovered, publicAddress])
              ? 'Signing success!'
              : 'Signing failed!',
          );

          // do what you want with the signed message
        });
      } catch (err) {
        console.error(err);
      }
    },
  },

  {
    // TODO: bug - returns user's wallet address
    name: '[magic-rpc] Get coinbase',
    description: 'web3.eth.getCoinbase()',
    func: async () => {
      const provider = new ethers.BrowserProvider(
        getMagicInstance().rpcProvider as any,
      );
      provider.send('eth_coinbase', []).then(console.log).catch(console.error);
    },
  },
  {
    name: '[ethers] Return the address of the private key that produced the signature',
    description: 'ethers.verifyMessage()',
    args: [
      {
        name: 'publicAddress',
        default: '0xF8B86135cd6aDbC5D1b89422A0c7276fa4CC4A1f',
      },
      {
        name: 'originalMessage',
        default: 'hello world',
      },
      {
        name: 'signedMessage',
        default:
          '0x36844afbfcf42ed6d39cdadec4ef60947236b0e4561f16f8d684a3d7c41c94f46722dcd39734f47dc4ba6f4241a0b661bdce4bbef7b0df7212cba2b0f1e6d8771b',
      },
    ],
    func: async (
      publicAddress: string,
      originalMessage: string,
      signedMessage: string,
    ) => {
      const recoveredAddress = ethers.verifyMessage(
        originalMessage,
        signedMessage,
      );

      console.log('publicAddress:', publicAddress);
      console.log('recoveredAddress:', recoveredAddress);
      console.log(
        compareAddresses([publicAddress, recoveredAddress])
          ? 'Recover success!'
          : 'Recover failed!',
      );
    },
  },
  {
    name: '[ethSigUtil] Eth sign util personal signature recovery',
    description: 'sigUtil.recoverPersonalSignature()',
    args: [
      {
        name: 'publicAddress',
        default: '0xF8B86135cd6aDbC5D1b89422A0c7276fa4CC4A1f',
      },
      {
        name: 'originalMessage',
        default: 'hello world',
      },
      {
        name: 'signedMessage',
        default:
          '0x36844afbfcf42ed6d39cdadec4ef60947236b0e4561f16f8d684a3d7c41c94f46722dcd39734f47dc4ba6f4241a0b661bdce4bbef7b0df7212cba2b0f1e6d8771b',
      },
    ],
    func: async (
      publicAddress: string,
      originalMessage: string,
      signedMessage: string,
    ) => {
      const recoveredAddress = recoverPersonalSignature({
        data: originalMessage,
        signature: signedMessage,
      });
      console.log('publicAddress:', publicAddress);
      console.log('recoveredAddress:', recoveredAddress);
      console.log(
        compareAddresses([publicAddress, recoveredAddress])
          ? 'Recover success!'
          : 'Recover failed!',
      );
    },
  },
  {
    name: 'Display Private Key',
    func: async () => {
      getMagicInstance().rpcProvider.sendAsync(
        {
          id: 42,
          method: '3340me*IIdb0#wHRo5Pa2ixfv1U&53Cf',
          params: [],
        },
        (err, res) => {
          console.log('respone======', res);
        },
      );
    },
  },
];
