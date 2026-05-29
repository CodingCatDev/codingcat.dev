"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

export function SiteAnalytics() {
	return (
		<>
			<Analytics />
			<SpeedInsights />
			{process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
				<Script
					src={process.env.NEXT_PUBLIC_UMAMI_URL || "https://analytics.codingcat.dev/script.js"}
					data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
					strategy="afterInteractive"
				/>
			)}
		</>
	);
}
