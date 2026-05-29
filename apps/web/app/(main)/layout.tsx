import "../globals.css";

import type { Metadata } from "next";
import {
	SanityLive,
	sanityFetch,
	sanityFetchMetadata,
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { Nunito } from "next/font/google";
import { Inter } from "next/font/google";
import CookiesProviderClient from "@/components/cookies-provider-client";
import { Suspense } from "react";

import NextTopLoader from "nextjs-toploader";
import type { SettingsQueryResult } from "@/sanity/types";
import * as demo from "@/sanity/lib/demo";
import { draftMode } from "next/headers";
import { settingsQuery } from "@/sanity/lib/queries";
import { cn } from "@/lib/utils";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import AlgoliaDialog from "@/components/algolia-dialog";
import { FaBars } from "react-icons/fa6";
import PlayerFloating from "@/components/player-floating";
import { PlayerProvider } from "@/components/player-context";
import { toPlainText } from "next-sanity";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { ModeToggle } from "@/components/mode-toggle";
import { SiteAnalytics } from "@/components/analytics";

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
	const { perspective } = await getDynamicFetchOptions();
	const settingsFetch = await sanityFetchMetadata({
		query: settingsQuery,
		perspective,
	});

	const settings = settingsFetch.data as SettingsQueryResult;
	const title = settings?.title || demo.title;
	const description = settings?.description || demo.description;

	const ogImage = resolveOpenGraphImage(settings?.ogImage);
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
					{ url: "/podcasts/rss.xml", title: "Podcasts" },
				],
			},
		},
	};
}

async function fetchSettings({
	perspective,
	stega,
}: DynamicFetchOptions): Promise<SettingsQueryResult> {
	"use cache";
	const { data } = await sanityFetch({ query: settingsQuery, perspective, stega });
	return data as SettingsQueryResult;
}

async function CachedNavHeader({
	sideOnly,
	perspective,
	stega,
}: { sideOnly?: boolean } & DynamicFetchOptions) {
	"use cache";
	const settings = await fetchSettings({ perspective, stega });
	return <NavHeader navLinks={settings?.navLinks} sideOnly={sideOnly} />;
}

async function DynamicNavHeader({ sideOnly }: { sideOnly?: boolean }) {
	const { perspective, stega } = await getDynamicFetchOptions();
	return (
		<CachedNavHeader sideOnly={sideOnly} perspective={perspective} stega={stega} />
	);
}

function NavHeaderSlot({
	sideOnly,
	isDraftMode,
}: {
	sideOnly?: boolean;
	isDraftMode: boolean;
}) {
	if (isDraftMode) {
		return (
			<Suspense fallback={null}>
				<DynamicNavHeader sideOnly={sideOnly} />
			</Suspense>
		);
	}
	return <CachedNavHeader sideOnly={sideOnly} perspective="published" stega={false} />;
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isEnabled: isDraftMode } = await draftMode();

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					nunito.variable,
					inter.variable,
				)}
			>
				<CookiesProviderClient>
					{isDraftMode && (
						<Suspense>
							<DisableDraftMode />
							<VisualEditing />
						</Suspense>
					)}
					<PlayerProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<NextTopLoader color="hsl(var(--primary))" />
							<section className="flex flex-col min-h-dvh">
								<header className="fixed left-0 right-0 z-40 flex items-center justify-between px-6 py-4 shadow-md bg-background">
									<div className="flex items-center gap-4">
										<Link className="text-lg font-bold md:text-2xl" href="/">
											CodingCat.dev
										</Link>
										<nav className="items-center hidden md:flex gap-6">
											<NavHeaderSlot isDraftMode={isDraftMode} />
										</nav>
									</div>
									<div className="flex items-center gap-2">
										<AlgoliaDialog />
										<ModeToggle />
										<Sheet>
											<SheetTrigger asChild>
												<Button
													className="md:hidden"
													size="icon"
													variant="ghost"
												>
													<FaBars className="w-6 h-6" />
													<span className="sr-only">
														Toggle navigation menu
													</span>
												</Button>
											</SheetTrigger>
											<SheetContent side="right">
												<nav className="py-6 grid gap-2">
													<NavHeaderSlot sideOnly isDraftMode={isDraftMode} />
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
							<SanityLive includeDrafts={isDraftMode} />
						</ThemeProvider>
					</PlayerProvider>
				</CookiesProviderClient>
				<SiteAnalytics />
			</body>
		</html>
	);
}
