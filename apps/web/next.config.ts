import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
