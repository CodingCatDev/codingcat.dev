import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PUBLISH_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_PUBLISH_DAYS = ["Mon", "Wed", "Fri"];

const CONTENT_CATEGORIES = [
	"JavaScript",
	"TypeScript",
	"React",
	"Next.js",
	"Angular",
	"Svelte",
	"Node.js",
	"CSS",
	"DevOps",
	"AI / ML",
	"Web Performance",
	"Tooling",
];

const RATE_CARD_TIERS = [
	{
		name: "Pre-roll Mention",
		description: "15-second sponsor mention at the start of the video",
		price: "$200",
	},
	{
		name: "Mid-roll Segment",
		description: "60-second dedicated sponsor segment mid-video",
		price: "$500",
	},
	{
		name: "Dedicated Video",
		description: "Full sponsored video with product deep-dive",
		price: "$1,500",
	},
];

const INTEGRATIONS = [
	{
		name: "Sanity",
		envVar: "SANITY_API_TOKEN",
		description: "Content management and data store",
	},
	{
		name: "YouTube",
		envVar: "YOUTUBE_API_KEY",
		description: "Video publishing and analytics",
	},
	{
		name: "Supabase",
		envVar: "NEXT_PUBLIC_SUPABASE_URL",
		description: "Authentication and database",
	},
	{
		name: "ElevenLabs",
		envVar: "ELEVENLABS_API_KEY",
		description: "AI voice generation for videos",
	},
	{
		name: "Gemini",
		envVar: "GEMINI_API_KEY",
		description: "Script generation and content AI",
	},
	{
		name: "Stripe",
		envVar: "STRIPE_SECRET_KEY",
		description: "Sponsor payment processing",
	},
	{
		name: "Resend",
		envVar: "RESEND_API_KEY",
		description: "Transactional email delivery",
	},
];

function IntegrationDot({ connected }: { connected: boolean }) {
	return (
		<span
			className={`inline-block h-2.5 w-2.5 rounded-full ${
				connected
					? "bg-green-500"
					: "bg-gray-300 dark:bg-gray-600"
			}`}
		/>
	);
}

export default function SettingsPage() {
	// Check which env vars are likely set (server component has access)
	const integrationStatus = INTEGRATIONS.map((integration) => ({
		...integration,
		connected: !!process.env[integration.envVar],
	}));

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Configure your content engine — cadence, categories, and rate card.
				</p>
			</div>

			<div className="rounded-lg border border-dashed bg-muted/50 p-4 text-sm text-muted-foreground">
				<strong>Note:</strong> Settings are currently read-only. Editing will be
				enabled in a future phase once a settings schema is added to Sanity.
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Publishing Cadence */}
				<Card>
					<CardHeader>
						<CardTitle>Publishing Cadence</CardTitle>
						<CardDescription>
							Control how often videos are published and on which days.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="videos-per-week">Videos per week</Label>
							<Input
								id="videos-per-week"
								type="number"
								defaultValue={3}
								min={1}
								max={7}
								disabled
								className="w-24"
							/>
						</div>
						<Separator />
						<div className="space-y-2">
							<Label>Preferred publish days</Label>
							<div className="flex flex-wrap gap-2">
								{PUBLISH_DAYS.map((day) => (
									<Badge
										key={day}
										variant={
											DEFAULT_PUBLISH_DAYS.includes(day)
												? "default"
												: "outline"
										}
										className="cursor-default"
									>
										{day}
									</Badge>
								))}
							</div>
						</div>
						<p className="text-xs text-muted-foreground">
							Settings will be stored in Sanity once a settings schema is
							created.
						</p>
					</CardContent>
				</Card>

				{/* Content Categories */}
				<Card>
					<CardHeader>
						<CardTitle>Content Categories</CardTitle>
						<CardDescription>
							Categories used for content idea classification and YouTube
							metadata.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-wrap gap-2">
							{CONTENT_CATEGORIES.map((category) => (
								<Badge key={category} variant="secondary">
									{category}
								</Badge>
							))}
						</div>
						<p className="text-xs text-muted-foreground">
							Custom category management will be available in a future phase.
						</p>
					</CardContent>
				</Card>

				{/* Sponsor Rate Card */}
				<Card>
					<CardHeader>
						<CardTitle>Sponsor Rate Card</CardTitle>
						<CardDescription>
							Sponsorship tiers and pricing used by the sponsor portal and
							pipeline.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{RATE_CARD_TIERS.map((tier) => (
								<div
									key={tier.name}
									className="flex items-center justify-between rounded-lg border p-3"
								>
									<div>
										<p className="text-sm font-medium">{tier.name}</p>
										<p className="text-xs text-muted-foreground">
											{tier.description}
										</p>
									</div>
									<span className="text-sm font-semibold">{tier.price}</span>
								</div>
							))}
						</div>
						<p className="mt-4 text-xs text-muted-foreground">
							Rate card editing will be available once the sponsor rate card
							schema is finalized.
						</p>
					</CardContent>
				</Card>

				{/* Integrations Status */}
				<Card>
					<CardHeader>
						<CardTitle>Integrations Status</CardTitle>
						<CardDescription>
							Connection status for external services. Green indicates the
							environment variable is configured.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{integrationStatus.map((integration) => (
								<div
									key={integration.name}
									className="flex items-center gap-3"
								>
									<IntegrationDot connected={integration.connected} />
									<div className="flex-1">
										<p className="text-sm font-medium">{integration.name}</p>
										<p className="text-xs text-muted-foreground">
											{integration.description}
										</p>
									</div>
									<Badge
										variant={integration.connected ? "default" : "outline"}
										className="text-xs"
									>
										{integration.connected ? "Connected" : "Not configured"}
									</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
