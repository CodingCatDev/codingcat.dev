
'use client';

import { Turnstile } from '@marsidev/react-turnstile';

export function CloudflareTurnstileWidget({ value, ...props }: { value?: string, [key: string]: any }) {
  return (
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
      {...props}
    />
  );
}
