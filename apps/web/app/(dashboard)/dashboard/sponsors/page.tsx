export const dynamic = "force-dynamic";

import { dashboardQuery } from "@/lib/sanity/dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SponsorLeadsTable } from "./sponsor-leads-table";
import { SponsorPoolTable } from "./sponsor-pool-table";
import { PageRefreshButton } from "@/components/page-refresh-button";

interface SponsorLead {
	_id: string;
	_createdAt: string;
	companyName: string;
	contactName: string;
	contactEmail: string;
	source: "inbound" | "outbound";
	status: "new" | "contacted" | "replied" | "negotiating" | "booked" | "paid";
	intent?: string;
	rateCard?: string;
	bookedSlot?: { title: string };
	lastEmailAt?: string;
	notes?: string;
}

interface SponsorPool {
	_id: string;
	companyName: string;
	contactName: string;
	contactEmail: string;
	website?: string;
	category?: string;
	source: "curated" | "enriched";
	relevanceScore?: number;
	lastContactedAt?: string;
}

const LEADS_QUERY = `*[_type == "sponsorLead"] | order(_createdAt desc) {
	_id,
	_createdAt,
	companyName,
	contactName,
	contactEmail,
	source,
	status,
	intent,
	rateCard,
	bookedSlot->{ title },
	lastEmailAt,
	notes
}`;

const POOL_QUERY = `*[_type == "sponsorPool" && optedOut != true] | order(relevanceScore desc) {
	_id,
	companyName,
	contactName,
	contactEmail,
	website,
	category,
	source,
	relevanceScore,
	lastContactedAt
}`;

export default async function SponsorsPage() {
	let leads: SponsorLead[] = [];
	let pool: SponsorPool[] = [];

	try {
		[leads, pool] = await Promise.all([
			dashboardQuery<SponsorLead[]>(LEADS_QUERY),
			dashboardQuery<SponsorPool[]>(POOL_QUERY),
		]);
	} catch (error) {
		console.error("Failed to fetch sponsor data:", error);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Sponsor Pipeline
					</h1>
					<p className="text-muted-foreground">
						Manage sponsor leads, track deals through the pipeline, and
						browse the sponsor pool.
					</p>
				</div>
				<PageRefreshButton />
			</div>

			<Tabs defaultValue="pipeline">
				<TabsList>
					<TabsTrigger value="pipeline">
						Pipeline{leads.length > 0 && ` (${leads.length})`}
					</TabsTrigger>
					<TabsTrigger value="pool">
						Sponsor Pool{pool.length > 0 && ` (${pool.length})`}
					</TabsTrigger>
				</TabsList>
				<TabsContent value="pipeline">
					<SponsorLeadsTable leads={leads} />
				</TabsContent>
				<TabsContent value="pool">
					<SponsorPoolTable sponsors={pool} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
