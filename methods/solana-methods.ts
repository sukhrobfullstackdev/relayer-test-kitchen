import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';
import * as web3 from '@solana/web3.js';
import { decodeUTF8 } from 'tweetnacl-util';
import nacl from 'tweetnacl';
import { type SolanaExtension } from '@magic-ext/solana';

export const groupName = 'Solana';

export const methods: MethodConfig[] = [
  {
    name: 'Personal sign',
    description: 'Signs & verifies a message',
    args: [],
    func: async () => {
      const message = 'The quick brown fox jumps over the lazy dog';
      const messageBytes = decodeUTF8(message);
      const magic = getMagicInstance<[SolanaExtension]>();
      const metadata = await magic.user.getMetadata();
      if (!metadata.publicAddress) return console.error('No user');
      const recipientPubKey = new web3.PublicKey(metadata.publicAddress);
      const signature = await magic.solana.signMessage(messageBytes);
      const result = nacl.sign.detached.verify(
        messageBytes,
        signature,
        recipientPubKey.toBytes(),
      );
      console.log(`Signing with public address: ${metadata.publicAddress}`);
      console.log(`Generated Signature: ${signature}`);
      console.log(`signature verification result: ${result}`);
      console.log(
        result ? 'Signing Success!' : 'Signature verification failed',
      );
    },
  },
  {
    name: 'Partial Sign Transaction',
    description: 'Sign Partial Solana Transaction',
    args: [],
    func: async () => {
      const magic = getMagicInstance();
      const rpcUrl = 'https://api.devnet.solana.com';
      const metadata = await magic.user.getMetadata();
      if (!metadata.publicAddress) return console.error('No user');
      const recipientPubKey = new web3.PublicKey(metadata.publicAddress);
      const payer = new web3.PublicKey(metadata.publicAddress);
      const connection = new web3.Connection(rpcUrl);

      const hash = await connection.getLatestBlockhash();

      const transactionMagic = new web3.Transaction({
        feePayer: payer,
        recentBlockhash: hash.blockhash,
      });

      const transaction = web3.SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipientPubKey,
        lamports: 1,
      });

      transactionMagic.add(...[transaction]);

      const serializeConfig = {
        requireAllSignatures: false,
        verifySignatures: true,
      };

      // @ts-expect-error - todo: figure out why typing is not working
      const signedTransaction = await magic.solana.partialSignTransaction(
        transactionMagic,
        serializeConfig,
      );

      console.log('Signed transaction', signedTransaction);
    },
  },
  {
    name: 'Get Balance',
    description: 'Returns SOL balance',
    args: [],
    func: async () => {
      const magic = getMagicInstance();
      const rpcUrl = 'https://api.devnet.solana.com';
      const metadata = await magic.user.getMetadata();
      if (!metadata.publicAddress) return console.error('No user');
      const recipientPubKey = new web3.PublicKey(metadata.publicAddress);
      const connection = new web3.Connection(rpcUrl);

      // Get the balance of the user's Solana address
      const balance = await connection.getBalance(recipientPubKey);

      console.log(`User's Solana balance: ${balance} lamports`);
      console.log(`Converted balance: ${balance / 10 ** 9} SOL`);
    },
  },
  {
    name: 'Sign transaction',
    description: 'Sign Solana Transaction',
    args: [],
    func: async () => {
      const magic = getMagicInstance<[SolanaExtension]>();
      const rpcUrl = 'https://api.devnet.solana.com';
      const metadata = await magic.user.getMetadata();
      if (!metadata.publicAddress) return console.error('No user');
      const recipientPubKey = new web3.PublicKey(metadata.publicAddress);
      const payer = new web3.PublicKey(metadata.publicAddress);
      const connection = new web3.Connection(rpcUrl);

      const hash = await connection.getLatestBlockhash();

      const transactionMagic = new web3.Transaction({
        feePayer: payer,
        recentBlockhash: hash.blockhash,
      });

      const transaction = web3.SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipientPubKey,
        lamports: 1,
      });

      transactionMagic.add(...[transaction]);

      const serializeConfig = {
        requireAllSignatures: false,
        verifySignatures: true,
      };

      const signedTransaction = await magic.solana.signTransaction(
        transactionMagic,
        serializeConfig,
      );

      console.log('Signed transaction', signedTransaction);
    },
  },
  {
    name: 'Sign and send 0 SOL transaction',
    description:
      'Faucet - https://faucet.solana.com/ & Explorer - https://explorer.solana.com/?cluster=devnet)',
    args: [],
    func: async () => {
      const magic = getMagicInstance<[SolanaExtension]>();
      const rpcUrl = 'https://api.devnet.solana.com';
      const metadata = await magic.user.getMetadata();
      if (!metadata.publicAddress) return console.error('No user');
      const recipientPubKey = new web3.PublicKey(metadata.publicAddress);
      const payer = new web3.PublicKey(metadata.publicAddress);
      const connection = new web3.Connection(rpcUrl);

      const hash = await connection.getLatestBlockhash();

      const transactionMagic = new web3.Transaction({
        feePayer: payer,
        recentBlockhash: hash.blockhash,
      });

      const transaction = web3.SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipientPubKey,
        lamports: 1,
      });

      transactionMagic.add(...[transaction]);

      const serializeConfig = {
        requireAllSignatures: false,
        verifySignatures: true,
      };

      const signedTransaction = await magic.solana.signTransaction(
        transactionMagic,
        serializeConfig,
      );

      console.log('Signed transaction', signedTransaction);
      const tx = web3.Transaction.from(signedTransaction.rawTransaction);
      const signature = await connection.sendRawTransaction(tx.serialize());
      console.log('TRANSACTION CONFIRMED', signature);
    },
  },
];
