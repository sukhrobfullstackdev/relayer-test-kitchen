/* eslint-disable @typescript-eslint/return-await */
import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';
import { type AptosExtension, MagicAptosWallet } from '@magic-ext/aptos';
import { AptosClient, CoinClient, FaucetClient } from 'aptos';

export const groupName = 'Aptos';

export const methods: MethodConfig[] = [
  {
    name: 'Request funds from faucet',
    description: 'Increase balance',
    args: [],
    func: async () => {
      const DEVNET_NODE_URL = 'https://fullnode.testnet.aptoslabs.com';
      const DEVNET_FAUCET_URL = 'https://faucet.testnet.aptoslabs.com';

      const aptosWallet = new MagicAptosWallet(getMagicInstance() as any, {
        connect: async () => {
          return await getMagicInstance<
            [AptosExtension]
          >().aptos.getAccountInfo();
        },
      });
      const accountInfo = await aptosWallet.account();

      if (!accountInfo) {
        console.warn('No account');
        return;
      }

      const faucetClient = new FaucetClient(DEVNET_NODE_URL, DEVNET_FAUCET_URL);
      await faucetClient.fundAccount(accountInfo.address, 100_000_000);

      const client = new AptosClient(DEVNET_NODE_URL);
      const coinClient = new CoinClient(client);
      const balance = await coinClient.checkBalance(accountInfo.address);
      console.log('New aptos balance:', balance);
    },
  },
  {
    name: 'Get balance',
    description: 'Get balance',
    args: [],
    func: async () => {
      const metadata = await getMagicInstance().user.getMetadata();
      if (!metadata.publicAddress) return console.error('No user');
      const DEVNET_NODE_URL = 'https://fullnode.testnet.aptoslabs.com';
      const client = new AptosClient(DEVNET_NODE_URL);
      const coinClient = new CoinClient(client);
      const balance = await coinClient.checkBalance(metadata.publicAddress);
      console.log('Aptos balance:', balance);
    },
  },
  {
    name: 'Personal sign',
    description: 'Signs a message',
    args: [],
    func: async () => {
      const aptosWallet = new MagicAptosWallet(getMagicInstance() as any, {
        connect: async () => {
          return await getMagicInstance<
            [AptosExtension]
          >().aptos.getAccountInfo();
        },
      });
      const SAMPLE_MESSAGE_PAYLOAD = {
        message: 'Hello from Aptos Wallet Adapter',
        nonce: 'random_string',
      };
      const result = await aptosWallet.signMessageAndVerify(
        SAMPLE_MESSAGE_PAYLOAD,
      );
      console.log(result ? 'Signing success!' : 'Signing failed!');
    },
  },
  {
    name: 'Send a transaction',
    description: 'Sends a transaction',
    args: [],
    func: async () => {
      const aptosWallet = new MagicAptosWallet(getMagicInstance() as any, {
        connect: async () => {
          return await getMagicInstance<
            [AptosExtension]
          >().aptos.getAccountInfo();
        },
      });
      const DEVNET_NODE_URL = 'https://fullnode.testnet.aptoslabs.com';
      const MAGIC_WALLET_ADDRESS =
        '0x906fd65afe31b7237cd4d7c4073d8bf76c61b6a24ec64dd26f0c16de5c2444d5';
      const SAMPLE_RAW_TRANSACTION = {
        type: 'entry_function_payload',
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: [MAGIC_WALLET_ADDRESS, 1000],
      };
      const { hash } = await aptosWallet.signAndSubmitTransaction(
        SAMPLE_RAW_TRANSACTION,
      );

      const client = new AptosClient(DEVNET_NODE_URL);
      await client.waitForTransaction(hash, {
        checkSuccess: true,
      });
      console.log('Transaction success! Hash:', hash);
    },
  },
];
