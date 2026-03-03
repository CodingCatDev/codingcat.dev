import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const hasSupabase =
		process.env.NEXT_PUBLIC_SUPABASE_URL &&
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	let user = null;
	if (hasSupabase) {
		const supabase = await createClient();
		const { data } = await supabase.auth.getUser();
		user = data?.user ?? null;
	}

	if (!user) {
		return <>{children}</>;
	}

	return (
		<SidebarProvider>
			<AppSidebar user={user} />
			<SidebarInset>
				<SiteHeader />
				<main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
