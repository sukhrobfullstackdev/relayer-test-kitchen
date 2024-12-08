'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getMagicInstance } from '@/lib/magic';

export default function RedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const magicCredential = searchParams?.get('magic_credential');

  useEffect(() => {
    const process = async () => {
      if (!magicCredential) {
        console.warn(
          'No magic_credential found in query string. Please go back and try again.',
        );
        return;
      }
      console.log('Got magic_credential from query string.');

      const didToken = await getMagicInstance().auth.loginWithCredential();
      if (!didToken) {
        console.warn("No DID token returned from Magic SDK's server");
        return;
      }
      console.log('Login with Magic SDK successful.');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const userMetadata = await getMagicInstance().user.getMetadata();
      console.log('userMetadata', userMetadata);

      setIsLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.replace('/');
    };

    process();
  }, [magicCredential]);

  return <div>{isLoading ? <p>Please wait...</p> : <p>Done!</p>}</div>;
}
