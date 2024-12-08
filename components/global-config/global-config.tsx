/* eslint-disable @typescript-eslint/no-shadow */
import { Extensions } from '@/const/extensions';
import { MuiThemeConfig } from '@/const/mui-theme-config';
import { SUPPORTED_NETWORKS } from '@/const/networks';
import { SUPPORTED_LOCALES } from '@/const/supported-locales';
import {
  setApiKey,
  setCustomChainId,
  setCustomRpcUrl,
  setLocale,
  setNetwork,
  setRelayerEndpoint,
  setWithOAuthExtension,
  setWithOIDCExtension,
  setWithGDKMSExtension,
  setLastActiveTabIdx,
  setWithWebauthnExtension,
} from '@/store/config-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  createTheme,
} from '@mui/material';
import { type FunctionComponent } from 'react';

export const theme = createTheme(MuiThemeConfig);

export const GlobalConfigurations: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const {
    apiKey,
    relayerEndpoint,
    network,
    customRpcUrl,
    customChainId,
    locale,
    withOAuthExtension,
    withOIDCExtension,
    withGDKMSExtension,
    withWebauthnExtension,
    user,
    suggestedKeys,
    suggestedNodeUrls,
    suggestedChainIds,
    lastActiveTabIdx,
  } = useAppSelector((state) => state.Config);

  const handleInvalidActiveTab = (tabName: string, include: boolean) => {
    if (lastActiveTabIdx === tabName && !include) {
      dispatch(setLastActiveTabIdx('Wallet'));
    }
  };

  const updateApiKey = (key: string) => {
    dispatch(setApiKey(key));
  };

  const updateRelayerEndpoint = (endpoint: string) => {
    let urlProtocol = '';
    if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
      urlProtocol = 'https://';
    }
    dispatch(setRelayerEndpoint(`${urlProtocol}${endpoint}`));
  };

  const updateNetwork = (network: string) => {
    dispatch(setNetwork(network));
  };

  const updateCustomRpcUrl = (customRpcUrl: string) => {
    dispatch(setCustomRpcUrl(customRpcUrl));
  };

  const updateCustomChainId = (customChainId: string) => {
    dispatch(setCustomChainId(customChainId));
  };

  const updateLocale = (locale: string) => {
    dispatch(setLocale(locale));
  };

  const updateWithOAuthExtension = (include: boolean) => {
    dispatch(setWithOAuthExtension(include));
    handleInvalidActiveTab(Extensions.OAUTH_V1, include);
    handleInvalidActiveTab(Extensions.OAUTH_V2, include);
  };

  const updateWithOIDCExtension = (include: boolean) => {
    dispatch(setWithOIDCExtension(include));

    handleInvalidActiveTab(Extensions.OIDC, include);
  };

  const updateWithGDKMSExtension = (include: boolean) => {
    dispatch(setWithGDKMSExtension(include));

    handleInvalidActiveTab(Extensions.GDKMS, include);
  };

  const updateWithWebauthnExtension = (include: boolean) => {
    dispatch(setWithWebauthnExtension(include));

    handleInvalidActiveTab(Extensions.WEBAUTHN, include);
  };

  return (
    <Stack sx={{ mt: 4, mb: 4 }}>
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography>
            <b>SDK Config</b>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={6}
              gap={2}
              alignItems="center"
              data-test-id="global-api-key"
            >
              <Autocomplete
                freeSolo
                options={suggestedKeys}
                value={apiKey || ''}
                onChange={(e) => updateApiKey((e.target as any).innerText)}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(e) => updateApiKey(e.target.value)}
                    placeholder="public key please"
                    label="Api Key"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} data-test-id="global-sdk-endpoint">
              <Autocomplete
                freeSolo
                options={[
                  'https://auth.magic.link',
                  'https://auth.stagef.magic.link',
                  'https://auth.dev.magic.link',
                  'http://localhost:3014',
                  'http://localhost:3024',
                ]}
                onChange={(e) =>
                  updateRelayerEndpoint((e.target as any).innerText)
                }
                value={relayerEndpoint || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(e) => updateRelayerEndpoint(e.target.value)}
                    placeholder="https://auth.magic.link"
                    label="Relayer Endpoint"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} data-test-id="global-locale">
              <FormControl>
                <InputLabel>Locale</InputLabel>
                <Select
                  value={locale}
                  label="Locale"
                  onChange={(e) => updateLocale(e.target.value)}
                  placeholder="english?"
                >
                  {SUPPORTED_LOCALES.map((locale) => (
                    <MenuItem key={locale} value={locale}>
                      {locale}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} data-test-id="global-network">
              <FormControl>
                <InputLabel>Network</InputLabel>
                <Select
                  value={network}
                  label="Network"
                  onChange={(e) => updateNetwork(e.target.value)}
                  placeholder="eth network?"
                >
                  {SUPPORTED_NETWORKS.map((network) => (
                    <MenuItem key={network} value={network}>
                      {network}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {network === 'custom' && (
              <Grid
                item
                xs={12}
                md={6}
                gap={2}
                alignItems="center"
                data-test-id="custom-node-url"
              >
                <Autocomplete
                  freeSolo
                  options={suggestedNodeUrls}
                  value={customRpcUrl || ''}
                  onChange={(e) =>
                    updateCustomRpcUrl((e.target as any).innerText)
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={(e) => updateCustomRpcUrl(e.target.value)}
                      placeholder="custom node url"
                      label="Custom Node Url"
                    />
                  )}
                />
              </Grid>
            )}
            {network === 'custom' && (
              <Grid
                item
                xs={12}
                md={6}
                gap={2}
                alignItems="center"
                data-test-id="custom-chain-id"
              >
                <Autocomplete
                  freeSolo
                  options={suggestedChainIds}
                  value={customChainId || ''}
                  onChange={(e) =>
                    updateCustomChainId((e.target as any).innerText)
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={(e) => updateCustomChainId(e.target.value)}
                      placeholder="custom chain id"
                      label="Custom Chain Id"
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12} data-test-id="toggle-extensions-note">
              <Typography>
                <i>Toggle extensions to show them in the panel</i>
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              data-test-id="global-include-oauth-extension"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={withOAuthExtension}
                    onChange={() =>
                      updateWithOAuthExtension(!withOAuthExtension)
                    }
                  />
                }
                label="Include OAuth Extension"
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              data-test-id="global-include-oidc-extension"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={withOIDCExtension}
                    onChange={() => updateWithOIDCExtension(!withOIDCExtension)}
                  />
                }
                label="Include OIDC Extension"
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              data-test-id="global-include-gdkms-extension"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={withGDKMSExtension}
                    onChange={() =>
                      updateWithGDKMSExtension(!withGDKMSExtension)
                    }
                  />
                }
                label="Include GDKMS Extension"
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              data-test-id="global-include-webauth-extension"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={withWebauthnExtension}
                    onChange={() =>
                      updateWithWebauthnExtension(!withWebauthnExtension)
                    }
                  />
                }
                label="Include Webauthn Extension"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {user && (
        <Accordion>
          <AccordionSummary>
            <Typography>
              <b>{network}</b> User Info
            </Typography>
            <Typography></Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={2} justifyContent="left">
              <Grid item>
                <Typography
                  style={{
                    userSelect: 'text',
                  }}
                  whiteSpace="pre"
                >
                  {JSON.stringify(user, null, 2)}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
};
