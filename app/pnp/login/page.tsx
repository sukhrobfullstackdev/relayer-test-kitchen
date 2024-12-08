'use client';
import { useAppSelector } from '@/store/hooks';
import store from '@/store/store';

import Script from 'next/script';

import { Provider } from 'react-redux';

export default function PnPLogin() {
  const { apiKey, relayerEndpoint } = useAppSelector((state) => state.Config);
  return (
    <Provider store={store}>
      <Script
        src={new URL('/pnp/login', relayerEndpoint).href}
        data-magic-publishable-api-key={apiKey}
        data-redirect-uri={
          new URL(
            '/pnp/callback',
            typeof window !== 'undefined'
              ? window.location.origin
              : 'https://auth.magic.link',
          )
        }
        data-terms-of-service-uri="/fake-terms-of-service"
        data-privacy-policy-uri="/fake-privacy-policy"
      />
    </Provider>
  );
}
