import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function useIsNavigating(): boolean {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsNavigating(true);
    };
    const handleStop = () => {
      setIsNavigating(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);
  return isNavigating;
}
