import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

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
