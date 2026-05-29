import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig: NextConfig = {
	cacheComponents: true,
	cacheLife: { default: sanity },
	images: {
		qualities: [75, 80],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
				port: "",
				pathname: "**",
			},
		],
	},
	serverExternalPackages: [
		"@remotion/lambda",
	],
};

export default nextConfig;
