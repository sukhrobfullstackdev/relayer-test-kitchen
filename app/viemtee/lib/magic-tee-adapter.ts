import { type IViemInjectableTeeAccountObj } from '../types/viem-injectable-tee-account-obj';

export const createMagicTeeAdapter = async (config: {
  endpoint?: string;
  magicSecretKey?: string;
}) => {
  const teeUrl = config.endpoint || 'https://global-tee-prod.magickms.com';
  const secretKey = config.magicSecretKey || 'sk_live_93731348C453584D';
  const headers = {
    'Content-Type': 'application/json',
    'x-magic-secret-key': secretKey,
  };
  const encryptionContext = 'test_123';

  // Create a new wallet group
  const createGroupUrl = `${teeUrl}/v1/api/wallet_group`;
  console.log('createGroupUrl', createGroupUrl);
  const resCreateGroup = await fetch(createGroupUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  }).then((res) => res.json());
  const newWalletGroupId = resCreateGroup.data.uuid;
  console.log('created wallet group id:', newWalletGroupId);

  // Create a new wallet for the user
  const createWalletUrl = `${teeUrl}/v1/api/wallet`;
  const wallet = await (
    await fetch(createWalletUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        encryption_context: encryptionContext,
        network: 'mainnet',
        wallet_group_id: newWalletGroupId,
        metadata: undefined,
      }),
    })
  ).json();
  console.log('create wallet', wallet);

  return {
    address: wallet.data.public_address,
    signMessage: async () => {
      // there is no tee sign message?
      return '0x1234567890123456789012345678901234567890';
    },
    signTransaction: async (transaction) => {
      const signTransactionUrl = `${teeUrl}/v1/api/wallet/sign_transaction`;
      const resSignTransaction = await (
        await fetch(signTransactionUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            payload: transaction,
            encryption_context: encryptionContext,
            access_key: wallet.data.access_key,
            wallet_id: wallet.data.wallet_id,
          }),
        })
      ).json();
      console.log('sign transaction', resSignTransaction);
      return resSignTransaction.data.transaction_hash;
    },
    signTypedData: async () => {
      // there is no tee sign typed data?
      return '0x1234567890123456789012345678901234567890';
    },
    source: 'custom',
    type: 'local',
    publicKey: wallet.data.public_address,
    nonceManager: undefined,
  } as IViemInjectableTeeAccountObj;
};
