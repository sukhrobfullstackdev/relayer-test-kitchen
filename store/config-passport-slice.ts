import { createSlice } from '@reduxjs/toolkit';

interface ConfigPassportState {
  apiKey: string;
  relayerEndpoint: string;
  lastActivePassportTabIdx: string;
  network: number;
}

const initialState: ConfigPassportState = {
  apiKey: 'pk_003A46714B3A2B90',
  relayerEndpoint: 'https://next-stage.magic.link',
  lastActivePassportTabIdx: 'Basic',
  network: 11_155_111,
};

const configPassportSlice = createSlice({
  name: 'Config-Passport',
  initialState,
  reducers: {
    setApiKey(state, action) {
      state.apiKey = action.payload;
    },
    setRelayerEndpoint(state, action) {
      state.relayerEndpoint = action.payload;
    },
    setLastActivePassportTabIdx(state, action) {
      state.lastActivePassportTabIdx = action.payload;
    },
    setNetwork(state, action) {
      state.network = action.payload;
    },
  },
});

export const {
  setApiKey,
  setRelayerEndpoint,
  setLastActivePassportTabIdx,
  setNetwork,
} = configPassportSlice.actions;

export default configPassportSlice.reducer;
