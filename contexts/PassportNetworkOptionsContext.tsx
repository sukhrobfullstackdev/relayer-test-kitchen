// NetworkContext.tsx
import { PassportNetworkIdToData } from '@/const/passport-network-data';
import { networkIdToViemNetwork } from '@/methods/passport/viem-methods';
import { setNetwork } from '@/store/config-passport-slice';
import { useAppSelector } from '@/store/hooks';
import store from '@/store/store';
import MagicPassport from 'magic-passport';
import { networks } from 'magic-passport/networks';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

// NOTE: ADD A FIELD TO THIS TYPE AND THEN ADD DEFAULTS IN /passport-network-data TO ADD NEW FIELDS TO THE NETWORK LEVEL OPTIONS
export interface PassportNetworkOptionsFields {
  recipientAddress: string;
  senderAddress: string;
  tokenId: number;
  contractUSDCAddress: string;
  vishalStorageContractAddress: string;
  payableNFTAddress: string;
  nonPayableNFTAddress: string;
}
export interface PassportNetworkContextType {
  network: number;
  setNetwork: (newetwork: number) => void;
  fieldValues: PassportNetworkOptionsFields;
  setFieldValues: React.Dispatch<
    React.SetStateAction<PassportNetworkOptionsFields>
  >;
  setFieldValue: <K extends keyof PassportNetworkOptionsFields>(
    key: K,
    value: PassportNetworkOptionsFields[K],
  ) => void;
  sdkInstance: MagicPassport;
}

const PassportNetworkContext = createContext<
  PassportNetworkContextType | undefined
>(undefined);

interface PassportNetworkProviderProps {
  children: ReactNode;
}

export const PassportNetworkProvider: React.FC<
  PassportNetworkProviderProps
> = ({ children }) => {
  const { apiKey, relayerEndpoint, network } = useAppSelector(
    (state) => state.ConfigPassport,
  );

  const [sdkInstance, setSdkInstance] = useState(
    new MagicPassport(apiKey, {
      endpoint: relayerEndpoint,
      network: networkIdToViemNetwork[network],
      debug: true,
    }),
  );

  const getDefaultFieldValuesForNetwork = (
    newNetwork: number,
  ): PassportNetworkOptionsFields => {
    const defaultFieldValues: Record<string, any> = {};
    Object.entries(PassportNetworkIdToData[newNetwork].defaultFieldValues).map(
      ([key, value]) => {
        defaultFieldValues[key] = value[0] ?? '';
      },
    );
    return defaultFieldValues as PassportNetworkOptionsFields;
  };

  const [fieldValues, setFieldValues] = useState<PassportNetworkOptionsFields>(
    network
      ? getDefaultFieldValuesForNetwork(network)
      : ({} as PassportNetworkOptionsFields),
  );

  const setNetworkInner = (newNetwork: number) => {
    store.dispatch(setNetwork(newNetwork));
  };

  useEffect(() => {
    if (network) {
      if (!networks[network]) {
        console.error(
          'network id ',
          network,
          ' does not exist on passport sdk',
        );
        return;
      }
      setFieldValues(getDefaultFieldValuesForNetwork(network));
      setSdkInstance(
        new MagicPassport(apiKey, {
          endpoint: relayerEndpoint,
          network: networks[network],
          debug: true,
        }),
      );
    } else {
      store.dispatch(setNetwork(11_155_111));
    }
  }, [apiKey, relayerEndpoint, network]);

  const setFieldValue = <K extends keyof PassportNetworkOptionsFields>(
    key: K,
    value: PassportNetworkOptionsFields[K],
  ) => {
    setFieldValues((prev) => {
      const newResult = { ...prev };
      newResult[key] = value;
      return newResult;
    });
  };

  const value = {
    network,
    setNetwork: setNetworkInner,
    fieldValues,
    setFieldValues,
    setFieldValue,
    sdkInstance,
  };

  return (
    <PassportNetworkContext.Provider value={value}>
      {children}
    </PassportNetworkContext.Provider>
  );
};

export const usePassportNetwork = () => {
  const context = useContext(PassportNetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
