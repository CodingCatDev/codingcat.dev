"use client"

import * as React from "react"
import {
	LayoutDashboard,
	Lightbulb,
	FileVideo,
	Handshake,
	Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"

const navItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Content",
		url: "/dashboard/content",
		icon: Lightbulb,
	},
	{
		title: "Videos",
		url: "/dashboard/videos",
		icon: FileVideo,
	},
	{
		title: "Sponsors",
		url: "/dashboard/sponsors",
		icon: Handshake,
	},
	{
		title: "Settings",
		url: "/dashboard/settings",
		icon: Settings,
	},
]

// TODO: Replace with real user data from auth
const placeholderUser = {
	name: "CodingCat",
	email: "admin@codingcat.dev",
	avatar: "",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/dashboard">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
									<LayoutDashboard className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">CodingCat.dev</span>
									<span className="truncate text-xs">Content Ops</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={placeholderUser} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
