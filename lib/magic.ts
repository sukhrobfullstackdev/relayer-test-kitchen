import {
  setSuggestedChainIds,
  setSuggestedKeys,
  setSuggestedNodeUrls,
} from '@/store/config-slice';
import store from '@/store/store';
import { OpenIdExtension } from '@magic-ext/oidc';
import { GDKMSExtension } from '@magic-ext/gdkms';
import { FlowExtension } from '@magic-ext/flow';
import { SolanaExtension } from '@magic-ext/solana';
import { AptosExtension } from '@magic-ext/aptos';
import { NearExtension } from '@magic-ext/near';
import { HederaExtension } from '@magic-ext/hedera';
import { KadenaExtension } from '@magic-ext/kadena';
import { OAuthExtension } from '@magic-ext/oauth';
import { OAuthExtension as OAuthExtension2 } from '@magic-ext/oauth2';
import { WebAuthnExtension } from '@magic-ext/webauthn';
import { Magic, type MagicSDKExtensionsOption } from 'magic-sdk';

const createMagicInstance = (options: any) => {
  return new Magic(store.getState().Config.apiKey, options);
};

const getExtensions = () => {
  const {
    withOAuthExtension,
    withOIDCExtension,
    withGDKMSExtension,
    withWebauthnExtension,
  } = store.getState().Config;
  const extensions = [] as any[];

  if (withOAuthExtension) extensions.push(new OAuthExtension());
  if (withOAuthExtension) extensions.push(new OAuthExtension2());
  if (withOIDCExtension) extensions.push(new OpenIdExtension());
  if (withGDKMSExtension) extensions.push(new GDKMSExtension());
  if (withWebauthnExtension) extensions.push(new WebAuthnExtension());

  return extensions;
};

const getBasicOptions = () => {
  const { relayerEndpoint: endpoint, locale } = store.getState().Config;
  return {
    endpoint,
    locale: locale ?? undefined,
    extensions: getExtensions(),
  };
};

const getEthMainnetInstance = () => {
  return createMagicInstance(getBasicOptions());
};

const getEthGoerliInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: 'goerli',
  });
};

const getEthGoerliCustomNodeInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://rpc.ankr.com/eth_goerli',
      chainId: 5,
    },
  });
};

const getEthSepoliaInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: 'sepolia',
  });
};

const getEthSepoliaCustomNodeInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://rpc2.sepolia.org',
      chainId: 11155111,
    },
  });
};

const getFantomMainnetInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://rpc.ftm.tools/',
      chainId: 250,
    },
  });
};

const getPolygonMainnetInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://polygon-rpc.com/',
      chainId: 137,
    },
  });
};

const getPolygonAmoyInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://rpc-amoy.polygon.technology',
      chainId: 80002,
    },
  });
};

const getHederaMainnetInstance = () => {
  const extensions = [
    new HederaExtension({
      network: 'mainnet',
    }),
    ...getExtensions(),
  ];
  return createMagicInstance({
    ...getBasicOptions(),
    extensions,
  });
};

const getAvalancheMainnetInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc/',
      chainId: 250,
    },
  });
};

const getOptimismMainnetInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://mainnet.optimism.io',
      chainId: 10,
    },
  });
};

const getFlowTestnetInstance = () => {
  const extensions = [
    new FlowExtension({
      rpcUrl: 'https://rest-testnet.onflow.org',
      network: 'testnet',
    }),
    ...getExtensions(),
  ];
  return createMagicInstance({
    ...getBasicOptions(),
    extensions,
  });
};

const getFlowMainnetInstance = () => {
  const extensions = [
    new FlowExtension({
      rpcUrl: 'https://rest-mainnet.onflow.org',
      network: 'mainnet',
    }),
    ...getExtensions(),
  ];
  return createMagicInstance({
    ...getBasicOptions(),
    extensions,
  });
};

const getZetaMainnetInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://api.mainnet.zetachain.com/evm',
      chainId: 7000,
    },
  });
};

const getZetaTestnetInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public',
      chainId: 7001,
    },
  });
};

const getChilizMainnetInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://rpc.ankr.com/chiliz',
      chainId: 88888,
    },
  });
};

const getChilizTestnetInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://spicy-rpc.chiliz.com/',
      chainId: 88882,
    },
  });
};

const getStabilityTestnetInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://alphanet.stble.io',
      chainId: 20180427,
    },
  });
};

const getBaseMainnetInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://mainnet.base.org',
      chainId: 8453,
    },
  });
};

const getBaseGoerliInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://goerli.base.org',
      chainId: 84531,
    },
  });
};

const getBaseSepoliaInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://sepolia.base.org',
      chainId: 84532,
    },
  });
};

const getArbitrumOneInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      chainId: 42161,
    },
  });
};

const getArbitrumSepoliaInstance = () => {
  return createMagicInstance({
    ...getBasicOptions(),
    network: {
      rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
      chainId: 421614,
    },
  });
};

const getAptosTestnetInstance = () => {
  const extensions = [
    new AptosExtension({
      nodeUrl: 'https://fullnode.testnet.aptoslabs.com',
    }),
    ...getExtensions(),
  ];
  return createMagicInstance({
    ...getBasicOptions(),
    extensions,
  });
};

const getNearTestnetInstance = () => {
  const extensions = [
    new NearExtension({
      rpcUrl: '',
    }),
    ...getExtensions(),
  ];
  return createMagicInstance({
    ...getBasicOptions(),
    extensions,
  });
};

const getKadenaTestnetInstance = () => {
  const extensions = [
    new KadenaExtension({
      rpcUrl:
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact',
      chainId: '1',
      networkId: 'testnet04',
      network: 'testnet',
      createAccountsOnChain: true,
    }),
    ...getExtensions(),
  ];
  return createMagicInstance({
    ...getBasicOptions(),
    extensions,
  });
};

const getSolanaDevnetInstance = () => {
  const extensions = [
    new SolanaExtension({
      rpcUrl: 'https://api.devnet.solana.com',
    }),
    ...getExtensions(),
  ];
  return createMagicInstance({
    ...getBasicOptions(),
    extensions,
  });
};

const getCustomNetworkInstance = () => {
  const { customRpcUrl: rpcUrl, customChainId: chainId } =
    store.getState().Config;
  const customNodeOptions = {
    rpcUrl: rpcUrl || '',
    chainId: parseInt(chainId || '') || 0,
  };
  return createMagicInstance({
    ...getBasicOptions(),
    network: customNodeOptions,
  });
};

const networkToGetterMapping = {
  'eth-mainnet': getEthMainnetInstance,
  'eth-goerli': getEthGoerliInstance,
  'eth-goerli-custom-node': getEthGoerliCustomNodeInstance,
  'eth-sepolia': getEthSepoliaInstance,
  'eth-sepolia-custom-node': getEthSepoliaCustomNodeInstance,
  'fantom-mainnet': getFantomMainnetInstance,
  'optimism-mainnet': getOptimismMainnetInstance,
  'avalanche-mainnet': getAvalancheMainnetInstance,
  'polygon-mainnet': getPolygonMainnetInstance,
  'polygon-amoy': getPolygonAmoyInstance,
  'flow-testnet': getFlowTestnetInstance,
  'flow-mainnet': getFlowMainnetInstance,
  'hedera-mainnet': getHederaMainnetInstance,
  'zeta-mainnet': getZetaMainnetInstance,
  'zeta-testnet': getZetaTestnetInstance,
  'chiliz-mainnet': getChilizMainnetInstance,
  'chiliz-testnet': getChilizTestnetInstance,
  'stability-testnet': getStabilityTestnetInstance,
  'base-mainnet': getBaseMainnetInstance,
  'base-goerli': getBaseGoerliInstance,
  'base-sepolia': getBaseSepoliaInstance,
  'arbitrum-one': getArbitrumOneInstance,
  'arbitrum-sepolia': getArbitrumSepoliaInstance,
  'solana-devnet': getSolanaDevnetInstance,
  'aptos-testnet': getAptosTestnetInstance,
  'near-testnet': getNearTestnetInstance,
  'kadena-testnet': getKadenaTestnetInstance,
  custom: getCustomNetworkInstance,
};

export const getMagicInstance = <T extends MagicSDKExtensionsOption>() => {
  const {
    network,
    apiKey,
    customRpcUrl,
    customChainId,
    suggestedKeys,
    suggestedNodeUrls,
    suggestedChainIds,
  } = store.getState().Config;
  try {
    if (!suggestedKeys.some((a: string) => a === apiKey)) {
      store.dispatch(setSuggestedKeys(apiKey));
    }
    if (
      customRpcUrl &&
      !suggestedNodeUrls.some((a: string) => a === customRpcUrl)
    ) {
      store.dispatch(setSuggestedNodeUrls(customRpcUrl));
    }
    if (
      customChainId &&
      !suggestedChainIds.some((a: string) => a === customChainId)
    ) {
      store.dispatch(setSuggestedChainIds(customChainId));
    }
  } catch (err) {
    console.log(err);
  }

  return networkToGetterMapping[network]() as Magic<T>;
};
