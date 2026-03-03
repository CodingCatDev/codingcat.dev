import { NextResponse } from "next/server";
import { dashboardQuery } from "@/lib/sanity/dashboard";

export const dynamic = "force-dynamic";

interface ActivityItem {
	_id: string;
	_type: string;
	_updatedAt: string;
	title?: string;
	companyName?: string;
	status?: string;
}

export async function GET() {
	try {
		const items = await dashboardQuery<ActivityItem[]>(`
			*[_type in ["contentIdea", "automatedVideo", "sponsorLead"]] | order(_updatedAt desc) [0..9] {
				_id,
				_type,
				_updatedAt,
				title,
				companyName,
				status
			}
		`);

		return NextResponse.json(items ?? []);
	} catch (error) {
		console.error("Failed to fetch activity:", error);
		return NextResponse.json([]);
	}
}
