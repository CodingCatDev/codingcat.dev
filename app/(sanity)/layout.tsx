import "../globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { metadata as studioMetadata, viewport } from "next-sanity/studio";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export { viewport };

export const metadata: Metadata = {
	...studioMetadata,
	icons: {
		icon: "/sanity-icons/icon.ico",
		apple: "/sanity-icons/apple-icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.variable}>
			<body className="min-h-screen">{children}</body>
		</html>
	);
}
