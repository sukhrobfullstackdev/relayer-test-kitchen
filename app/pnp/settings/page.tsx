'use client';
import { useAppSelector } from '@/store/hooks';
import Script from 'next/script';

export default function PnPSettings() {
  const { apiKey, relayerEndpoint } = useAppSelector((state) => state.Config);

  return (
    <Script
      src={new URL('/pnp/settings?v=1', relayerEndpoint).href}
      data-magic-publishable-api-key={apiKey}
      data-redirect-uri={
        new URL(
          '/pnp/callback',
          typeof window !== 'undefined'
            ? window.location.origin
            : 'https://auth.magic.link',
        )
      }
      data-login-uri={
        new URL(
          '/pnp/login',
          typeof window !== 'undefined'
            ? window.location.origin
            : 'https://auth.magic.link',
        )
      }
    />
  );
}
