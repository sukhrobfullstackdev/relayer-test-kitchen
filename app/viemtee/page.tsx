'use client';
import { createKernelAccount, createKernelAccountClient } from '@zerodev/sdk';
import { createKernelCABClient, CAB_V0_1 } from '@zerodev/cab';

import { useEffect, useState } from 'react';
// import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import {
  createWalletClient,
  createPublicClient,
  http,
  encodeFunctionData,
  erc20Abi,
  type Hex,
} from 'viem';

import { toMultiChainECDSAValidator } from '@zerodev/multi-chain-validator';

import {
  walletClientToSmartAccountSigner,
  ENTRYPOINT_ADDRESS_V07,
  bundlerActions,
} from 'permissionless';
import { KERNEL_V3_1 } from '@zerodev/sdk/constants';
/*import {
  createAccount,
  TK_APP_PRIVATE_KEY,
  TK_APP_PUBLIC_KEY,
  TK_ORG_ID,
  TK_WALLET_PUBADDR,
} from './lib/turnkey-reference';
import { TurnkeyClient } from '@turnkey/http';
import { type IViemInjectableTeeAccountObj } from './types/viem-injectable-tee-account-obj'; */
import { sepolia, baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { type EntryPoint } from 'permissionless/types';
import { Button } from '@mui/material';

const SEPOLIA_RPC_URL = 'https://rpc.sepolia.org';
const SEPOLIA_PROJECT_ID = 'fcea3102-acfe-40e6-8263-c4bd60d1544f';
const SEPOLIA_BUNDLER_RPC = `https://rpc.zerodev.app/api/v2/bundler/${SEPOLIA_PROJECT_ID}`;

const BASE_SEPOLIA_RPC_URL =
  'https://base-sepolia.blockpi.network/v1/rpc/public';
const BASE_SEPOLIA_PROJECT_ID = 'bf7fe1bb-5ad8-4106-b3b5-6bc36250ec35';
const BASE_SEPOLIA_BUNDLER_RPC = `https://rpc.zerodev.app/api/v2/bundler/${BASE_SEPOLIA_PROJECT_ID}`;

const CAB_PAYMASTER_URL = `https://cab-paymaster-service.onrender.com/paymaster/api`;
const entryPoint = ENTRYPOINT_ADDRESS_V07 as EntryPoint;

export default function ViemTeePage() {
  const [network, setNetwork] = useState('baseSepolia');

  useEffect(() => {
    const doStuff = async () => {
      // Turnkey / Reference implementation
      /* const stamper = new ApiKeyStamper({
        apiPublicKey: TK_APP_PUBLIC_KEY,
        apiPrivateKey: TK_APP_PRIVATE_KEY,
      });
      const turnkeyClient = new TurnkeyClient(
        { baseUrl: 'https://api.turnkey.com' },
        stamper,
      );
      const whoami = await turnkeyClient.getWhoami({
        organizationId: TK_ORG_ID,
      });
      setTurnkeyWhoAmI(whoami);
      const turnkeyAccount = (await createAccount({
        client: turnkeyClient,
        organizationId: TK_ORG_ID, // Your subOrganization id
        signWith: TK_WALLET_PUBADDR, // TK_WALLET_PUBADDR, // Your suborganization `signWith` param.
      })) as IViemInjectableTeeAccountObj;
      setTurnkeyAccountObject(turnkeyAccount); */

      const eoaAccount = privateKeyToAccount(
        '0x2dbd9e413b08d9d1af5e8a37478bc515824377e47688883b7a7eac75a58df5d1',
      );

      const walletClient = createWalletClient({
        account: eoaAccount,
        transport:
          network === 'baseSepolia'
            ? http(BASE_SEPOLIA_RPC_URL)
            : http(SEPOLIA_RPC_URL),
      });
      const smartAccountSigner = walletClientToSmartAccountSigner(walletClient);
      const publicClient = createPublicClient({
        chain: network === 'baseSepolia' ? baseSepolia : sepolia,
        transport: http(),
      });
      const ecdsaValidator = await toMultiChainECDSAValidator(publicClient, {
        signer: smartAccountSigner,
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        kernelVersion: KERNEL_V3_1,
      });

      const kernelAccount = await createKernelAccount(publicClient, {
        plugins: {
          sudo: ecdsaValidator,
        },
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        kernelVersion: KERNEL_V3_1,
      });

      console.log('kernelAccount: ', kernelAccount);

      const kernelClient = createKernelAccountClient({
        // @ts-expect-error: expected error, zero dev will fix on their side.
        account: kernelAccount,
        entryPoint,
        chain: network === 'baseSepolia' ? baseSepolia : sepolia,
        bundlerTransport:
          network === 'baseSepolia'
            ? http(BASE_SEPOLIA_BUNDLER_RPC)
            : http(SEPOLIA_BUNDLER_RPC),
      });

      const cabClient = createKernelCABClient(kernelClient, {
        transport: http(CAB_PAYMASTER_URL),
        entryPoint,
        cabVersion: CAB_V0_1,
      });

      await cabClient.enableCAB({
        tokens: [
          {
            name: '6TEST',
            networks: [sepolia.id, baseSepolia.id],
          },
        ],
      });

      const cabBalance = await cabClient.getCabBalance({
        address: kernelAccount.address,
        token: '6TEST',
      });

      // usdc decimal value
      const usdcDecimals = BigInt('1000000');

      console.log('kernelAccount.address: ', kernelAccount.address);
      console.log(
        '6TEST cabBalance: ',
        Number(cabBalance) / Number(usdcDecimals),
      );

      const sendNativeGasTokensCalls = [
        {
          to: '0x39E7c1330E83a429f7cF2a367A4c6E6eC6E86f1E' as `0x${string}`,
          value: BigInt(0),
          data: '0x' as `0x${string}`,
        },
      ];

      const send6TestTokensCalls = [
        {
          to: '0x3870419Ba2BBf0127060bCB37f69A1b1C090992B' as Hex,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'transfer',
            args: [kernelAccount.address, BigInt(1000)],
          }),
          value: BigInt(0),
        },
      ];

      console.log('send6TestTokensCalls: ', send6TestTokensCalls);
      console.log('sendNativeGasTokensCalls: ', sendNativeGasTokensCalls);

      const { userOperation, repayTokensInfo, sponsorTokensInfo } =
        await cabClient.prepareUserOperationRequestCAB({
          calls: sendNativeGasTokensCalls,
          repayTokens: ['6TEST'],
        });
      console.log('userOperation: ', userOperation);
      console.log('repayTokensInfo: ', repayTokensInfo);
      console.log('sponsorTokensInfo: ', sponsorTokensInfo);
      // this is doing a eth_sendUserOperation under the hood.
      const userOpHash = await cabClient.sendUserOperationCAB({
        userOperation,
      });

      // find this on jiffy scan
      console.log('userOpHash: ', userOpHash);

      // @ts-expect-error type incompatibilities due to permissionless version
      const bundlerClient = kernelClient.extend(bundlerActions(entryPoint));
      const transactionHash = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
        timeout: 100_000_000,
      });

      // find this on the chain scanner
      console.log('transactionHash for user op: ', transactionHash);

      /*const { userOperation } = await cabClient.prepareUserOperationRequestCAB({
        calls,
        repayTokens: ['USDC'],
      });
      const userOpHash = await cabClient.sendUserOperationCAB({
        userOperation,
      });

      const bundlerClient = cabClient.extend(bundlerActions(entryPoint));
      await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });

      console.log('userOp completed');*/
    };

    doStuff();
  }, [network]);

  return (
    <div>
      <h1>
        <b>Viem + TEE + ZeroDev</b>
      </h1>
      <h2>Network: {network}</h2>
      <Button
        disabled={network === 'baseSepolia'}
        onClick={() => setNetwork('baseSepolia')}
      >
        BaseSepolia
      </Button>
      <Button
        disabled={network === 'sepolia'}
        onClick={() => setNetwork('sepolia')}
      >
        Sepolia
      </Button>
      <h2>Viem stuff</h2>
      <h2>ZeroDev stuff</h2>
    </div>
  );
}
