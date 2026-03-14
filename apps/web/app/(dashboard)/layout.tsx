import "../globals.css";

import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
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

export const metadata: Metadata = {
	title: {
		template: "%s | CodingCat.dev Dashboard",
		default: "Content Ops Dashboard | CodingCat.dev",
	},
	description: "Manage your automated content engine",
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Try to get user — if Supabase isn't configured or user isn't logged in,
	// the proxy will have already redirected to login for protected routes.
	// The login page itself renders without the sidebar chrome.
	let user = null;
	try {
		const supabaseUrl =
			process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
		const supabaseAnonKey =
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

		if (supabaseUrl && supabaseAnonKey) {
			const { createClient } = await import("@/lib/supabase/server");
			const supabase = await createClient();
			const { data } = await supabase.auth.getUser();
			user = data?.user ?? null;
		}
	} catch {
		// Supabase not available — continue without user
	}

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					nunito.variable,
					inter.variable,
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{user ? (
						<SidebarProvider>
							<AppSidebar user={user} />
							<SidebarInset>
								<SiteHeader />
								<main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
									{children}
								</main>
							</SidebarInset>
						</SidebarProvider>
					) : (
						<>{children}</>
					)}
					<Toaster />
				</ThemeProvider>
				<SiteAnalytics />
			</body>
		</html>
	);
}
