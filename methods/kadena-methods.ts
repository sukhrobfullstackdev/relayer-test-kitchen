import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';
import { type KadenaExtension } from '@magic-ext/kadena';
import { addSignatures, createClient, Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export const groupName = 'Kadena';

export const methods: MethodConfig[] = [
  {
    name: 'Get Balance',
    description: 'Returns KDA balance',
    args: [],
    func: async () => {
      const magic = getMagicInstance<[KadenaExtension]>();
      const chainId = '1';
      const networkId = 'testnet04';
      const rpcUrl = `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
      const kadenaClient = createClient(rpcUrl);
      const metadata = await magic.user.getMetadata();
      if (!metadata.publicAddress) return console.error('No user');

      try {
        const transaction = Pact.builder
          .execution(
            (Pact.modules as any).coin['get-balance'](metadata.publicAddress),
          )
          .setMeta({ chainId })
          .createTransaction();
        const res = await kadenaClient.local(transaction, { preflight: false });
        if (res.result.status === 'failure') {
          console.error('Failed to get balance:', res.result.error);
          return;
        }
        console.log('KDA balance:', (res.result as any).data as number);
      } catch (error) {
        console.error('Failed to get balance:', error);
      }
    },
  },
  {
    name: 'Sign transaction',
    description: 'Sign Kadena Transaction',
    args: [],
    func: async () => {
      const magic = getMagicInstance<[KadenaExtension]>();
      const chainId = '1';
      const networkId = 'testnet04';
      const rpcUrl = `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
      const kadenaClient = createClient(rpcUrl);
      const metadata = await magic.user.getMetadata();
      if (!metadata.publicAddress) return console.error('No user');
      const toAccount =
        'k:4e610b1987ed7fcd4a39389ace5afb6cc7980598af9a37ad8c896ecb72a67598';
      const senderPublicKey = metadata.publicAddress.substring(2);
      const receiverPublicKey = toAccount.substring(2);
      const amount = new PactNumber('0.0001').toPactDecimal();

      const transaction = Pact.builder
        .execution(
          (Pact.modules as any).coin.transfer(
            metadata.publicAddress,
            toAccount,
            amount,
          ),
        )
        .addData('receiverKeyset', {
          keys: [receiverPublicKey],
          pred: 'keys-all',
        })
        .addSigner(senderPublicKey, (withCapability) => [
          withCapability('coin.GAS'),
          withCapability(
            'coin.TRANSFER',
            metadata.publicAddress,
            toAccount,
            amount,
          ),
        ])
        .setMeta({ chainId, senderAccount: metadata.publicAddress })
        .setNetworkId(networkId)
        .createTransaction();

      try {
        console.log('unsigned transaction', transaction);
        const signature = await magic.kadena.signTransaction(transaction.hash);
        console.log('signature', signature);
        const signedTx = addSignatures(transaction, signature);
        console.log('signed transaction', signedTx);
        const response = await kadenaClient.local(signedTx);
        console.log('response', response);
        if (response.result.status === 'failure') {
          console.log('FAILED');
          console.error((response.result.error as any).message);
        }
        if (response.result.status === 'success') {
          console.log('SUCCESS');
        }
      } catch (error) {
        console.error('Failed to sign transaction:', error);
      }
    },
  },
  {
    name: 'Sign and send transaction',
    description:
      'Sends 0.0001 KDA - (Faucet - https://tools.kadena.io/faucet/new)',
    args: [],
    func: async () => {
      const magic = getMagicInstance<[KadenaExtension]>();
      const chainId = '1';
      const networkId = 'testnet04';
      const rpcUrl = `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
      const kadenaClient = createClient(rpcUrl);
      const metadata = await magic.user.getMetadata();
      if (!metadata.publicAddress) return console.error('No user');
      const toAccount =
        'k:4e610b1987ed7fcd4a39389ace5afb6cc7980598af9a37ad8c896ecb72a67598';
      const senderPublicKey = metadata.publicAddress.substring(2);
      const receiverPublicKey = toAccount.substring(2);
      const amount = new PactNumber('0.0001').toPactDecimal();

      const transaction = Pact.builder
        .execution(
          (Pact.modules as any).coin.transfer(
            metadata.publicAddress,
            toAccount,
            amount,
          ),
        )
        .addData('receiverKeyset', {
          keys: [receiverPublicKey],
          pred: 'keys-all',
        })
        .addSigner(senderPublicKey, (withCapability) => [
          withCapability('coin.GAS'),
          withCapability(
            'coin.TRANSFER',
            metadata.publicAddress,
            toAccount,
            amount,
          ),
        ])
        .setMeta({ chainId, senderAccount: metadata.publicAddress })
        .setNetworkId(networkId)
        .createTransaction();

      try {
        console.log('unsigned transaction', transaction);
        const signature = await magic.kadena.signTransaction(transaction.hash);
        console.log('signature', signature);
        const signedTx = addSignatures(transaction, signature);
        console.log('signed transaction', signedTx);
        const transactionDescriptor = await kadenaClient.submit(signedTx);
        console.log('broadcasting transaction...', transactionDescriptor);
        const response = await kadenaClient.listen(transactionDescriptor);
        if (response.result.status === 'failure') {
          console.log('FAILED');
          console.error(response.result.error);
        } else {
          console.log('SUCCESS');
          console.log(response.result);
        }
      } catch (error) {
        console.error('Failed to send transaction', error);
      }
    },
  },
];
