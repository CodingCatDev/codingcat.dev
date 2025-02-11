import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { SanityLive } from "@/sanity/lib/live";
import { Nunito } from "next/font/google";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import { Suspense } from 'react'

import NextTopLoader from "nextjs-toploader";
import type { SettingsQueryResult } from "@/sanity/types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import AvatarDropdown from "./avatar-dropdown";
import AlgoliaDialog from "@/components/algolia-dialog";
import { FaBars } from "react-icons/fa6";
import PlayerFloating from "@/components/player-floating";
import { PlayerProvider } from "@/components/player-context";
import { toPlainText, VisualEditing } from "next-sanity";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import MetaPixel from "./meta-pixel";

const nunito = Nunito({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-nunito",
});
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
	const settingsFetch = await sanityFetch({
		query: settingsQuery,
		// Metadata should never contain stega
		stega: false,
	});

	const settings = settingsFetch.data as SettingsQueryResult;
	const title = settings?.title || demo.title;
	const description = settings?.description || demo.description;

	// const ogImage = resolveOpenGraphImage(settings?.ogImage);
	const ogImage = settings?.ogImage?.secure_url;
	return {
		title: {
			template: `%s | ${title}`,
			default: title,
		},
		description: toPlainText(description),
		openGraph: {
			images: ogImage ? [ogImage] : [],
			siteName: "CodingCat.dev",
			url: "https://codingcat.dev",
		},
		alternates: {
			types: {
				"application/rss+xml": [
					{ url: "/blog/rss.xml", title: "Blog" },
					{ url: "/courses/rss.xml", title: "Courses" },
					{ url: "/podcasts/rss.xml", title: "Podcasts" },
				],
			},
		},
	};
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const settingsFetch = await sanityFetch({
		query: settingsQuery,
	});
	const settings = settingsFetch.data as SettingsQueryResult;

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					nunito.variable,
					inter.variable,
				)}
			>
				<Suspense>
					<SpeedInsights />
					<MetaPixel />
					<DisableDraftMode />
					<VisualEditing />
				</Suspense>
				<PlayerProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<NextTopLoader color="hsl(var(--primary))" />
						<section className="flex flex-col min-h-[100dvh]">
							<header className="fixed left-0 right-0 z-40 flex items-center justify-between px-6 py-4 shadow-md bg-background">
								<div className="flex items-center gap-4">
									<Link className="text-lg font-bold md:text-2xl" href="/">
										CodingCat.dev
									</Link>
									<nav className="items-center hidden md:flex gap-6">
										<NavHeader navLinks={settings?.navLinks} />
									</nav>
								</div>
								<div className="flex items-center gap-2">
									<AlgoliaDialog />
									<AvatarDropdown />
									<Sheet>
										<SheetTrigger asChild>
											<Button className="md:hidden" size="icon" variant="ghost">
												<FaBars className="w-6 h-6" />
												<span className="sr-only">Toggle navigation menu</span>
											</Button>
										</SheetTrigger>
										<SheetContent side="right">
											<nav className="py-6 grid gap-2">
												<SheetTrigger asChild>
													<NavHeader navLinks={settings?.navLinks} sideOnly />
												</SheetTrigger>
											</nav>
										</SheetContent>
									</Sheet>
								</div>
							</header>
							<main className="mt-20">{children}</main>
							<Toaster />
							<Footer />
						</section>
						<PlayerFloating />
						<SanityLive />
						{(await draftMode()).isEnabled && (
							<>
								<DisableDraftMode />
								<VisualEditing />
							</>
						)}
						<SpeedInsights />
					</ThemeProvider>
				</PlayerProvider>
			</body>
		</html>
	);
}
