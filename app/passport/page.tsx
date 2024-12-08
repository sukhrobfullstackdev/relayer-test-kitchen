'use client';

import { GlobalConfigurationsPassport } from '@/components/global-config/global-config-passport';
import { createMethodGroup } from '@/components/method-group/method-group';
import { PassportNetworkOptions } from '@/components/PassportNetworkOptions';
import {
  PassportNetworkProvider,
  usePassportNetwork,
} from '@/contexts/PassportNetworkOptionsContext';
import { PassportMethods } from '@/methods/passport';
import { setLastActivePassportTabIdx } from '@/store/config-passport-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import React from 'react';

function PageInner() {
  const { lastActivePassportTabIdx } = useAppSelector(
    (state) => state.ConfigPassport,
  );
  const dispatch = useAppDispatch();
  const passportNetworkConfig = usePassportNetwork();

  const handleChange = (event: React.SyntheticEvent, groupName: string) => {
    dispatch(setLastActivePassportTabIdx(groupName));
  };

  function renderTabs() {
    return PassportMethods.map(({ groupName }) => (
      <Tab key={groupName} label={groupName} value={groupName} wrapped />
    ));
  }

  function renderTabPanels() {
    return PassportMethods.map(({ groupName, methodArgToggle, methods }) => {
      const methodGroup = createMethodGroup(
        groupName,
        methodArgToggle,
        methods(passportNetworkConfig),
        lastActivePassportTabIdx,
        true,
      );
      return (
        lastActivePassportTabIdx === groupName &&
        React.createElement(methodGroup, { key: groupName })
      );
    });
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#f6f6f6',
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
          <Typography color="text.primary" variant="h3" textAlign={'center'}>
            Passport Test Kitchen 🛂
          </Typography>
          <GlobalConfigurationsPassport />
          <PassportNetworkOptions />
          <br />
          <br />
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
                value={lastActivePassportTabIdx}
                onChange={handleChange}
                aria-label="passport sdk tabs"
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
      </div>
    </>
  );
}

export default function Page() {
  return (
    <PassportNetworkProvider>
      <PageInner />
    </PassportNetworkProvider>
  );
}
