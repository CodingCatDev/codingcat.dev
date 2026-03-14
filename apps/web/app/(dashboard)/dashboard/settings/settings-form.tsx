"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";

interface RateCardTier {
	name: string;
	description: string;
	price: number;
}

interface DashboardSettings {
	videosPerWeek: number;
	publishDays: string[];
	contentCategories: string[];
	rateCardTiers: RateCardTier[];
}

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEFAULT_SETTINGS: DashboardSettings = {
	videosPerWeek: 3,
	publishDays: ["Mon", "Wed", "Fri"],
	contentCategories: [
		"JavaScript", "TypeScript", "React", "Next.js", "Angular",
		"Svelte", "Node.js", "CSS", "DevOps", "AI / ML",
		"Web Performance", "Tooling",
	],
	rateCardTiers: [
		{ name: "Pre-roll Mention", description: "15-second sponsor mention at the start of the video", price: 200 },
		{ name: "Mid-roll Segment", description: "60-second dedicated sponsor segment mid-video", price: 500 },
		{ name: "Dedicated Video", description: "Full sponsored video with product deep-dive", price: 1500 },
	],
};

export function SettingsForm() {
	const [settings, setSettings] = useState<DashboardSettings>(DEFAULT_SETTINGS);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [newCategory, setNewCategory] = useState("");

	const fetchSettings = useCallback(async () => {
		try {
			const res = await fetch("/api/dashboard/settings");
			if (res.ok) {
				const data = await res.json();
				setSettings({
					videosPerWeek: data.videosPerWeek ?? DEFAULT_SETTINGS.videosPerWeek,
					publishDays: data.publishDays ?? DEFAULT_SETTINGS.publishDays,
					contentCategories: data.contentCategories ?? DEFAULT_SETTINGS.contentCategories,
					rateCardTiers: data.rateCardTiers ?? DEFAULT_SETTINGS.rateCardTiers,
				});
			}
		} catch {
			// Use defaults on error
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSettings();
	}, [fetchSettings]);

	const handleSave = async () => {
		setSaving(true);
		try {
			const res = await fetch("/api/dashboard/settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(settings),
			});
			if (res.ok) {
				toast.success("Settings saved successfully");
			} else {
				const data = await res.json();
				toast.error(data.error || "Failed to save settings");
			}
		} catch {
			toast.error("Failed to save settings");
		} finally {
			setSaving(false);
		}
	};

	const toggleDay = (day: string) => {
		setSettings((prev) => ({
			...prev,
			publishDays: prev.publishDays.includes(day)
				? prev.publishDays.filter((d) => d !== day)
				: [...prev.publishDays, day],
		}));
	};

	const addCategory = () => {
		const trimmed = newCategory.trim();
		if (!trimmed || settings.contentCategories.includes(trimmed)) return;
		setSettings((prev) => ({
			...prev,
			contentCategories: [...prev.contentCategories, trimmed],
		}));
		setNewCategory("");
	};

	const removeCategory = (category: string) => {
		setSettings((prev) => ({
			...prev,
			contentCategories: prev.contentCategories.filter((c) => c !== category),
		}));
	};

	const updateTier = (index: number, field: keyof RateCardTier, value: string | number) => {
		setSettings((prev) => ({
			...prev,
			rateCardTiers: prev.rateCardTiers.map((tier, i) =>
				i === index ? { ...tier, [field]: value } : tier
			),
		}));
	};

	const addTier = () => {
		setSettings((prev) => ({
			...prev,
			rateCardTiers: [...prev.rateCardTiers, { name: "", description: "", price: 0 }],
		}));
	};

	const removeTier = (index: number) => {
		setSettings((prev) => ({
			...prev,
			rateCardTiers: prev.rateCardTiers.filter((_, i) => i !== index),
		}));
	};

	if (loading) {
		return (
			<div className="grid gap-6 md:grid-cols-2">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader>
							<div className="h-5 w-32 animate-pulse rounded bg-muted" />
							<div className="h-4 w-48 animate-pulse rounded bg-muted" />
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="h-8 w-full animate-pulse rounded bg-muted" />
								<div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<>
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
								value={settings.videosPerWeek}
								min={1}
								max={14}
								onChange={(e) =>
									setSettings((prev) => ({
										...prev,
										videosPerWeek: Number.parseInt(e.target.value, 10) || 1,
									}))
								}
								className="w-24"
							/>
						</div>
						<Separator />
						<div className="space-y-2">
							<Label>Preferred publish days</Label>
							<div className="flex flex-wrap gap-2">
								{ALL_DAYS.map((day) => (
									<Badge
										key={day}
										variant={
											settings.publishDays.includes(day)
												? "default"
												: "outline"
										}
										className="cursor-pointer select-none transition-colors"
										onClick={() => toggleDay(day)}
									>
										{day}
									</Badge>
								))}
							</div>
						</div>
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
							{settings.contentCategories.map((category) => (
								<Badge
									key={category}
									variant="secondary"
									className="group gap-1 pr-1"
								>
									{category}
									<button
										type="button"
										onClick={() => removeCategory(category)}
										className="ml-0.5 rounded-full p-0.5 opacity-50 transition-opacity hover:bg-destructive/20 hover:opacity-100"
									>
										<X className="h-3 w-3" />
									</button>
								</Badge>
							))}
						</div>
						<div className="flex gap-2">
							<Input
								placeholder="Add category…"
								value={newCategory}
								onChange={(e) => setNewCategory(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addCategory();
									}
								}}
								className="flex-1"
							/>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addCategory}
								disabled={!newCategory.trim()}
							>
								<Plus className="mr-1 h-4 w-4" />
								Add
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Sponsor Rate Card */}
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Sponsor Rate Card</CardTitle>
						<CardDescription>
							Sponsorship tiers and pricing used by the sponsor portal and
							pipeline.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{settings.rateCardTiers.map((tier, index) => (
								<div
									key={index}
									className="flex items-start gap-3 rounded-lg border p-3"
								>
									<div className="flex-1 space-y-2">
										<div className="grid gap-2 sm:grid-cols-3">
											<div>
												<Label className="text-xs">Tier Name</Label>
												<Input
													value={tier.name}
													onChange={(e) =>
														updateTier(index, "name", e.target.value)
													}
													placeholder="Tier name"
												/>
											</div>
											<div>
												<Label className="text-xs">Description</Label>
												<Input
													value={tier.description}
													onChange={(e) =>
														updateTier(index, "description", e.target.value)
													}
													placeholder="Description"
												/>
											</div>
											<div>
												<Label className="text-xs">Price ($)</Label>
												<Input
													type="number"
													value={tier.price}
													onChange={(e) =>
														updateTier(
															index,
															"price",
															Number.parseInt(e.target.value, 10) || 0,
														)
													}
													placeholder="0"
													min={0}
												/>
											</div>
										</div>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="mt-5 shrink-0 text-destructive hover:bg-destructive/10"
										onClick={() => removeTier(index)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="mt-3"
							onClick={addTier}
						>
							<Plus className="mr-1 h-4 w-4" />
							Add Tier
						</Button>
					</CardContent>
				</Card>
			</div>

			<div className="flex justify-end pt-2">
				<Button onClick={handleSave} disabled={saving}>
					{saving ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Save className="mr-2 h-4 w-4" />
					)}
					{saving ? "Saving…" : "Save Settings"}
				</Button>
			</div>
		</>
	);
}
