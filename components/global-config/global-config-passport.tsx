/* eslint-disable @typescript-eslint/no-shadow */
import { MuiThemeConfig } from '@/const/mui-theme-config';
import { setApiKey, setRelayerEndpoint } from '@/store/config-passport-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Grid,
  Stack,
  TextField,
  Typography,
  createTheme,
} from '@mui/material';
import { type FunctionComponent } from 'react';

export const theme = createTheme(MuiThemeConfig);

export const GlobalConfigurationsPassport: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { relayerEndpoint, apiKey } = useAppSelector(
    (state) => state.ConfigPassport,
  );

  const updateApiKey = (key: string) => {
    dispatch(setApiKey(key));
  };

  const updateRelayerEndpoint = (endpoint: string) => {
    dispatch(setRelayerEndpoint(`${endpoint}`));
  };

  const suggestedKeys = ['pk_523A3911A44EBBE0', 'pk_003A46714B3A2B90'];

  return (
    <Stack sx={{ mt: 4, mb: 4 }}>
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography>
            <b>SDK Config - Passport</b>
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
                  'https://app.stagef.magiclabs.com',
                  'http://localhost:3024',
                  'https://app.magiclabs.com',
                ]}
                onChange={(e) =>
                  updateRelayerEndpoint((e.target as any).innerText)
                }
                value={relayerEndpoint || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(e) => updateRelayerEndpoint(e.target.value)}
                    placeholder="https://app.magiclabs.com"
                    label="Relayer Endpoint"
                  />
                )}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};
