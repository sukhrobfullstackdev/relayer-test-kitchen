'use client';
import React, { useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
} from '@mui/material';
import {
  setApiKey,
  setLastActiveTabIdx,
  setNetwork,
  setRelayerEndpoint,
} from '@/store/config-slice';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { E2eMethods } from '@/methods';
import { createMethodGroup } from '@/components/method-group/method-group';
import {
  GlobalConfigurations,
  theme,
} from '@/components/global-config/global-config';
import { EnvToRelayerEndpointMap } from '@/const/env-to-relayer-endpoint';
import { Extensions } from '@/const/extensions';
import { getMagicInstance } from '@/lib/magic';

type RelayerEndpointMap =
  | 'phantomLocal'
  | 'dev'
  | 'stagef'
  | 'prod'
  | 'mandrakeLocal';

export default function Home() {
  const {
    network,
    lastActiveTabIdx,
    apiKey,
    relayerEndpoint,
    withOAuthExtension,
    withOIDCExtension,
    withGDKMSExtension,
    withWebauthnExtension,
  } = useAppSelector((state) => state.Config);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getMagicInstance().preload();
  }, [network]);

  useEffect(() => {
    try {
      let qsNetwork, qsApiKey, qsRelayerEnv;
      if (typeof window !== 'undefined') {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        qsNetwork = urlParams.get('network');
        qsApiKey = urlParams.get('api_key');
        qsRelayerEnv = urlParams.get('env') as RelayerEndpointMap;
      }

      dispatch(setNetwork(qsNetwork ?? network ?? 'eth-mainnet'));

      dispatch(setApiKey(qsApiKey ?? apiKey ?? 'pk_live_A6849AF1E65489A5'));

      if (qsRelayerEnv && EnvToRelayerEndpointMap[qsRelayerEnv]) {
        dispatch(setRelayerEndpoint(EnvToRelayerEndpointMap[qsRelayerEnv]));
      } else {
        dispatch(
          setRelayerEndpoint(relayerEndpoint ?? 'https://auth.magic.link'),
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  const handleChange = (event: React.SyntheticEvent, groupName: string) => {
    dispatch(setLastActiveTabIdx(groupName));
  };

  const getFilteredE2eMethods = () => {
    return E2eMethods.filter(({ groupName }) => {
      if (groupName === Extensions.OAUTH_V1 && !withOAuthExtension)
        return false;
      if (groupName === Extensions.OAUTH_V2 && !withOAuthExtension)
        return false;
      if (groupName === Extensions.OIDC && !withOIDCExtension) return false;
      if (groupName === Extensions.GDKMS && !withGDKMSExtension) return false;
      return !(groupName === Extensions.WEBAUTHN && !withWebauthnExtension);
    });
  };

  function renderTabs() {
    const filteredMethods = getFilteredE2eMethods();
    return filteredMethods.map(({ groupName }) => (
      <Tab key={groupName} label={groupName} value={groupName} wrapped />
    ));
  }

  function renderTabPanels() {
    const filteredMethods = getFilteredE2eMethods();
    return filteredMethods.map(({ groupName, methodArgToggle, methods }) => {
      const methodGroup = createMethodGroup(
        groupName,
        methodArgToggle,
        methods,
        lastActiveTabIdx,
      );
      return (
        lastActiveTabIdx === groupName &&
        React.createElement(methodGroup, { key: groupName })
      );
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack
        sx={{
          padding: 2,
        }}
      >
        <Stack
          sx={{
            maxWidth: '732px',
            marginX: 'auto',
            my: 2,
            width: '100%',
          }}
        >
          <Typography color="text.primary" variant="h3">
            Relayer Test Kitchen 🍳
          </Typography>
          <GlobalConfigurations />
        </Stack>
        <Stack
          sx={{
            maxWidth: '732px',
            marginX: 'auto',
            width: '100%',
          }}
        >
          <Box>
            <Tabs
              sx={{ mb: 2 }}
              value={lastActiveTabIdx}
              onChange={handleChange}
              aria-label="magic sdk tabs"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              {renderTabs()}
            </Tabs>
          </Box>
          {renderTabPanels()}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
