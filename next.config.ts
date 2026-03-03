import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
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
		"@remotion/bundler",
		"@remotion/cli",
		"@rspack/core",
		"@rspack/binding",
	],
};

export default nextConfig;
