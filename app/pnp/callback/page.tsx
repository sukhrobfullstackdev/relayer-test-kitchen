/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';
import { useAppSelector } from '@/store/hooks';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useIsMounted } from 'usable-react';
import styles from './callback.module.css';

export default function PnPCallback() {
  const { apiKey, relayerEndpoint } = useAppSelector((state) => state.Config);
  const [idToken, setIdToken] = useState('Loading...');
  const [userMetadata, setUserMetadata] = useState('Loading...');
  const [oauth, setOAuthResponse] = useState('Loading...');

  const isMounted = useIsMounted();

  useEffect(() => {
    const handleReady = (e: any) => {
      const {
        idToken: idTokenRes,
        userMetadata: userMetadataRes,
        oauth: oauthRes,
      } = e.detail;

      if (isMounted()) {
        setIdToken(JSON.stringify(idTokenRes, null, 2));
        setUserMetadata(JSON.stringify(userMetadataRes, null, 2));
        setOAuthResponse(JSON.stringify(oauthRes ?? null, null, 2));
      }
    };

    const hasWindow = typeof window !== 'undefined';

    if (hasWindow) window.addEventListener('@magic/ready', handleReady);
    return () => {
      if (hasWindow) window.removeEventListener('@magic/ready', handleReady);
    };
  }, []);

  return (
    <div>
      <Script
        src={new URL('/pnp/callback', relayerEndpoint).href}
        data-magic-publishable-api-key={apiKey}
      />

      <div>
        <div className={styles.data}>
          <label>window.Magic.user.getIdToken()</label>
          <pre id={styles.idToken}>{idToken}</pre>
        </div>

        <div className={styles.data}>
          <label>window.Magic.user.getMetadata()</label>
          <pre id={styles.userMetadata}>{userMetadata}</pre>
        </div>

        <div className={styles.data}>
          <label>window.Magic.oauth.getRedirectResult()</label>
          <pre id={styles.oauth}>{oauth}</pre>
        </div>
        <div style={{ height: '12px' }} />
        <a href="/pnp/settings">Settings</a>
        <div style={{ height: '12px' }} />
        <a href="/pnp/logout">Logout</a>
      </div>
    </div>
  );
}
