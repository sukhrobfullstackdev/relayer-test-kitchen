import { PassportNetworkIdToData } from '@/const/passport-network-data';
import {
  type PassportNetworkOptionsFields,
  usePassportNetwork,
} from '@/contexts/PassportNetworkOptionsContext';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// TODO: on picking network there should be map from network id to 1. network option object 2. network name 3. default options for fields

export const PassportNetworkOptions = () => {
  const { network, setNetwork, fieldValues, setFieldValue } =
    usePassportNetwork();
  return (
    <Stack sx={{ mt: 4, mb: 4 }}>
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography>
            <b>Network Level Options</b>
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
              data-test-id="global-network"
            >
              <FormControl style={{ width: '100%' }}>
                <InputLabel>Network</InputLabel>
                <Select
                  style={{ width: '100%' }}
                  value={network}
                  label="Network"
                  onChange={(e) => setNetwork(parseInt(`${e.target.value}`))}
                  placeholder="eth network?"
                >
                  {Object.values(PassportNetworkIdToData).map((_network) => (
                    <MenuItem
                      key={`network-select-passport-${_network.networkOption.id}`}
                      value={_network.networkOption.id}
                    >
                      {_network.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {fieldValues &&
              Object.entries(fieldValues).map(([key, value]) => {
                return (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    gap={2}
                    alignItems="center"
                    data-test-id={key}
                    key={`passport-network-field-${key}`}
                  >
                    <Autocomplete
                      freeSolo
                      options={
                        PassportNetworkIdToData[network].defaultFieldValues[
                          key as keyof PassportNetworkOptionsFields
                        ]
                      }
                      value={value}
                      onChange={(e) =>
                        setFieldValue(
                          key as keyof PassportNetworkOptionsFields,
                          (e.target as any).innerText,
                        )
                      }
                      renderOption={(props, option) => (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onChange={(e) =>
                            setFieldValue(
                              key as keyof PassportNetworkOptionsFields,
                              e.target.value,
                            )
                          }
                          placeholder={key}
                          label={key}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};
