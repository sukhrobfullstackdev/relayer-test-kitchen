import { type SupportedLocale } from 'magic-sdk';
import { createSlice } from '@reduxjs/toolkit';
import { type SUPPORTED_NETWORKS } from '@/const/networks';

interface ConfigState {
  apiKey: string;
  relayerEndpoint: string;
  network: (typeof SUPPORTED_NETWORKS)[number];
  customRpcUrl: string;
  customChainId: string;
  locale: SupportedLocale | undefined;
  email: string;
  genericRpcMethodName: string;
  genericRpcMethodParams: string;
  phoneNumber: string;

  lastActiveTabIdx: string;
  withOAuthExtension: boolean;
  withOIDCExtension: boolean;
  withGDKMSExtension: boolean;
  withWebauthnExtension: boolean;
  filter: string;
  user: any;

  suggestedKeys: string[];
  suggestedNodeUrls: string[];
  suggestedChainIds: string[];

  auth0Id: string;
  auth0Domain: string;
  auth0ProviderId: string;
}

const initialState: ConfigState = {
  apiKey: 'pk_live_A6849AF1E65489A5',
  relayerEndpoint: 'https://auth.magic.link',
  network: 'eth-mainnet',
  customRpcUrl: '',
  customChainId: '',
  locale: 'en_US',
  email: 'hiro@magic.link',
  phoneNumber: '+19999999999',
  genericRpcMethodName: 'magic_auth_login_with_email_otp',
  genericRpcMethodParams: '{"showUI": true, "email": "david.he@magic.link"}',

  lastActiveTabIdx: 'Wallet',
  withOAuthExtension: false,
  withOIDCExtension: false,
  withGDKMSExtension: false,
  withWebauthnExtension: false,
  filter: '',
  user: undefined,

  suggestedKeys: [],
  suggestedNodeUrls: [],
  suggestedChainIds: [],

  auth0Id: '',
  auth0Domain: '',
  auth0ProviderId: '',
};

const configSlice = createSlice({
  name: 'Config',
  initialState,
  reducers: {
    setApiKey(state, action) {
      state.apiKey = action.payload;
    },
    setRelayerEndpoint(state, action) {
      state.relayerEndpoint = action.payload;
    },
    setNetwork(state, action) {
      state.network = action.payload;
    },
    setCustomRpcUrl(state, action) {
      state.customRpcUrl = action.payload;
    },
    setCustomChainId(state, action) {
      state.customChainId = action.payload;
    },
    setLocale(state, action) {
      state.locale = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setLastActiveTabIdx(state, action) {
      state.lastActiveTabIdx = action.payload;
    },
    setWithOAuthExtension(state, action) {
      state.withOAuthExtension = action.payload;
    },
    setWithOIDCExtension(state, action) {
      state.withOIDCExtension = action.payload;
    },
    setWithGDKMSExtension(state, action) {
      state.withGDKMSExtension = action.payload;
    },
    setWithWebauthnExtension(state, action) {
      state.withWebauthnExtension = action.payload;
    },
    setSuggestedKeys(state, action) {
      state.suggestedKeys = [...state.suggestedKeys, action.payload];
    },
    setSuggestedNodeUrls(state, action) {
      state.suggestedNodeUrls = [...state.suggestedNodeUrls, action.payload];
    },
    setSuggestedChainIds(state, action) {
      state.suggestedChainIds = [...state.suggestedChainIds, action.payload];
    },
    setAuth0Id(state, action) {
      state.auth0Id = action.payload;
    },
    setAuth0Domain(state, action) {
      state.auth0Domain = action.payload;
    },
    setAuth0ProviderId(state, action) {
      state.auth0ProviderId = action.payload;
    },
    setPhoneNumber(state, action) {
      state.phoneNumber = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setGenericRpcMethodName(state, action) {
      state.genericRpcMethodName = action.payload;
    },
    setGenericRpcMethodParams(state, action) {
      state.genericRpcMethodParams = action.payload;
    },
  },
});

export const {
  setApiKey,
  setRelayerEndpoint,
  setNetwork,
  setCustomRpcUrl,
  setCustomChainId,
  setLocale,
  setUser,
  setLastActiveTabIdx,
  setWithOAuthExtension,
  setWithOIDCExtension,
  setWithGDKMSExtension,
  setWithWebauthnExtension,
  setSuggestedKeys,
  setSuggestedNodeUrls,
  setSuggestedChainIds,
  setAuth0Id,
  setAuth0Domain,
  setAuth0ProviderId,
  setPhoneNumber,
  setEmail,
  setGenericRpcMethodName,
  setGenericRpcMethodParams,
} = configSlice.actions;
export default configSlice.reducer;
