import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';
import * as nearAPI from 'near-api-js';
import { type QueryResponseKind } from 'near-api-js/lib/providers/provider';
import { type NearExtension } from '@magic-ext/near';

export const groupName = 'Near';

const networkId = 'testnet';

const getNearInstance = async () => {
  const { connect, keyStores } = nearAPI;

  const config = {
    networkId,
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: `https://rpc.${networkId}.near.org`,
    walletUrl: `https://wallet.${networkId}.near.org`,
    helperUrl: `https://helper.${networkId}.near.org`,
    explorerUrl: `https://explorer.${networkId}.near.org`,
    headers: {},
  };

  // connect to NEAR
  const near = await connect(config);
  return near;
};

export const methods: MethodConfig[] = [
  {
    name: 'Sign transaction',
    description: 'Signs a transaction',
    args: [],
    func: async () => {
      const magic = getMagicInstance<[NearExtension]>();
      const user = await magic.user.getMetadata();
      if (!user.publicAddress) return console.error('User not logged in');
      const publicAddress = user.publicAddress;
      const publicKeyString = await magic.near.getPublicKey();

      const publicKey = nearAPI.utils.PublicKey.fromString(publicKeyString);

      const actions = [nearAPI.transactions.transfer(BigInt(1))];
      const provider = new nearAPI.providers.JsonRpcProvider({
        url: `https://rpc.${networkId}.near.org`,
      });
      let accessKey: QueryResponseKind;

      try {
        accessKey = await provider.query(
          `access_key/${user.publicAddress}/${publicKey.toString()}`,
          '',
        );
      } catch (error) {
        accessKey = {
          block_hash: 'AswGYz1J1FEEJW9c6aRKppZVPivzSKMGn5tVmJWANpJ9',
          block_height: 158227802,
          // @ts-expect-error allow nonce number
          nonce: 158161839000003,
          permission: 'FullAccess',
        };
      }

      const recentBlockHash = nearAPI.utils.serialize.base_decode(
        accessKey.block_hash,
      );

      const transaction = nearAPI.transactions.createTransaction(
        publicAddress,
        publicKey,
        publicAddress,
        0,
        actions,
        recentBlockHash,
      );

      const rawTransaction = transaction.encode();

      const result = await magic.near.signTransaction({
        rawTransaction,
        networkID: 'testnet',
      });

      const signedTransaction = nearAPI.transactions.SignedTransaction.decode(
        Buffer.from(result.encodedSignedTransaction),
      );

      console.log('signedTransaction', signedTransaction);
    },
  },
  {
    name: 'Send transaction',
    description: 'Sends 0.01 NEAR to self',
    args: [],
    func: async () => {
      const near = await getNearInstance();
      const magic = getMagicInstance<[NearExtension]>();
      const userMetadata = await magic.user.getInfo();
      if (!userMetadata.publicAddress)
        return console.error('User not logged in');
      const publicKeyString = await magic.near.getPublicKey();
      const publicKey = nearAPI.utils.PublicKey.fromString(publicKeyString);

      // Grabbing the account nonce
      const provider = new nearAPI.providers.JsonRpcProvider({
        url: `https://rpc.${networkId}.near.org`,
      });
      const accessKey = await provider.query(
        `access_key/${userMetadata.publicAddress}/${publicKey.toString()}`,
        '',
      );

      // @ts-expect-error allow nonce increment
      const nonce = ++accessKey.nonce; // increment current nonce for next transaction

      const actions = [nearAPI.transactions.transfer(BigInt(1))];

      // Near transactions must be sent with the blockhash of a block mined within the last 24 hours
      const status = await near.connection.provider.status();
      const blockHash = status.sync_info.latest_block_hash;
      const serializedBlockHash =
        nearAPI.utils.serialize.base_decode(blockHash);

      const transaction = nearAPI.transactions.createTransaction(
        userMetadata.publicAddress, // sender address
        publicKey, // sender public key
        userMetadata.publicAddress, // receiver
        nonce, // sender account nonce
        actions, // transaction instructions
        serializedBlockHash, // hash of a block mined within prev 24 hours
      );

      const rawTransaction = transaction.encode();
      const result = await magic.near.signTransaction({
        rawTransaction,
        networkID: 'testnet',
      });
      const signedTransaction = nearAPI.transactions.SignedTransaction.decode(
        Buffer.from(result.encodedSignedTransaction),
      );
      const receipt =
        await near.connection.provider.sendTransaction(signedTransaction);
      console.log('Hash', receipt.transaction.hash);
    },
  },
  {
    name: 'Get balance',
    description: 'Gets user testnet balance',
    args: [],
    func: async () => {
      const near = await getNearInstance();
      const magic = getMagicInstance();

      const metadata = await magic.user.getInfo();
      if (!metadata.publicAddress) return console.error('User not logged in');
      const account = await near.account(metadata.publicAddress);
      account
        .getAccountBalance()
        .then((bal) =>
          console.log(
            'Balance:',
            nearAPI.utils.format.formatNearAmount(bal.total),
          ),
        );
    },
  },
];
