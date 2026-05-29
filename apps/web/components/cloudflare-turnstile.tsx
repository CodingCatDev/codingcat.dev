"use client";

import { Turnstile } from "@marsidev/react-turnstile";

export function CloudflareTurnstileWidget({
	value,
	onChange,
	...props
}: {
	value?: string;
	onChange?: (token: string) => void;
	[key: string]: any;
}) {
	return (
		<Turnstile
			siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
			onSuccess={(token) => {
				if (onChange) {
					onChange(token);
				}
			}}
			{...props}
		/>
	);
}
