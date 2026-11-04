"use client";

import React, { useMemo, useState } from "react";
import { type ObjectInputProps, set } from "sanity";

export type TierRank = "S" | "A" | "B" | "C" | "D";

export interface StudioTierDetail {
	_key: string;
	_type: "tierDetail";
	label: string;
	value: string;
}

export interface StudioTierItem {
	_key: string;
	_type: "tierItem";
	tier: TierRank;
	name: string;
	category?: string;
	summary?: string;
	badge?: string;
	url?: string;
	details?: StudioTierDetail[];
}

export interface StudioTierListValue {
	_type?: "tierList";
	_key?: string;
	title?: string;
	subtitle?: string;
	ajComment?: string;
	items?: StudioTierItem[];
}

const TIER_ORDER: TierRank[] = ["S", "A", "B", "C", "D"];

const TIER_CONFIG: Record<
	TierRank,
	{
		rank: TierRank;
		label: string;
		bg: string;
		text: string;
	}
> = {
	S: { rank: "S", label: "Purrfect", bg: "#FF7F7F", text: "#2A1155" },
	A: { rank: "A", label: "Strong Pick", bg: "#FFBF7F", text: "#2A1155" },
	B: { rank: "B", label: "Solid w/ Caveats", bg: "#FFDF7F", text: "#2A1155" },
	C: { rank: "C", label: "Situational", bg: "#BFFF7F", text: "#2A1155" },
	D: { rank: "D", label: "Pass / Caution", bg: "#7FFFFF", text: "#2A1155" },
};

function makeKey(prefix = "ti"): string {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeTierRank(raw?: string): TierRank {
	const cleaned = (raw || "").trim().toUpperCase();
	const first = cleaned.charAt(0);
	if (
		first === "S" ||
		first === "A" ||
		first === "B" ||
		first === "C" ||
		first === "D"
	) {
		return first;
	}
	return "B";
}

function stripMarkdownFormatting(text: string): string {
	return text
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\*([^*]+)\*/g, "$1")
		.trim();
}

/**
 * Parses a GFM Markdown table (`| Tier | Platform | Camp | Verdict | ... |`)
 * into structured `StudioTierItem[]`.
 */
export function parseMarkdownTableToTierItems(
	markdown: string,
): StudioTierItem[] {
	const lines = markdown
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter((l) => l.startsWith("|") && l.endsWith("|"));

	if (lines.length < 2) {
		return [];
	}

	const rows: string[][] = [];
	for (const line of lines) {
		const cells = line
			.slice(1, -1)
			.split("|")
			.map((c) => stripMarkdownFormatting(c));
		const isSeparator = cells.every((c) => /^:?-{2,}:?$/.test(c));
		if (!isSeparator) {
			rows.push(cells);
		}
	}

	if (rows.length < 2) {
		return [];
	}

	const [headers, ...bodyRows] = rows;
	const verdictIdx = headers.findIndex((h) =>
		/verdict|why|summary|notes/i.test(h),
	);
	const pricingIdx = headers.findIndex((h) =>
		/price|pricing|cost|quota/i.test(h),
	);

	return bodyRows.map((cells, rIdx) => {
		const tier = normalizeTierRank(cells[0] ?? "B");
		const name = (cells[1] ?? `Platform ${rIdx + 1}`).trim();
		const category = (cells[2] ?? "").trim();

		let summary = "";
		if (verdictIdx >= 3 && cells[verdictIdx]) {
			summary = cells[verdictIdx].trim();
		} else if (cells[3]) {
			summary = cells[3].trim();
		}

		const details: StudioTierDetail[] = [];
		for (let cIdx = 3; cIdx < cells.length; cIdx++) {
			const val = (cells[cIdx] ?? "").trim();
			if (!val || val === summary) {
				continue;
			}
			const label = (headers[cIdx] ?? `Spec ${cIdx - 2}`).trim();
			details.push({
				_key: makeKey("td"),
				_type: "tierDetail",
				label,
				value: val,
			});
		}

		const badge =
			pricingIdx >= 2 && cells[pricingIdx]
				? cells[pricingIdx].trim()
				: undefined;

		return {
			_key: makeKey("ti"),
			_type: "tierItem",
			tier,
			name,
			...(category ? { category } : {}),
			...(summary ? { summary } : {}),
			...(badge ? { badge } : {}),
			details,
		};
	});
}

/**
 * Serializes `StudioTierItem[]` back into a clean GFM Markdown table so the
 * author can bulk-edit or copy-paste into blog posts/scripts.
 */
export function serializeTierItemsToMarkdownTable(
	items: StudioTierItem[],
): string {
	// Collect unique detail labels in order of appearance
	const detailLabels: string[] = [];
	for (const item of items) {
		for (const d of item.details ?? []) {
			if (d.label && !detailLabels.includes(d.label)) {
				detailLabels.push(d.label);
			}
		}
	}

	const headers = [
		"Tier",
		"Platform",
		"Camp",
		"Alex's Architectural Verdict",
		...detailLabels,
	];
	const headerLine = `| ${headers.join(" | ")} |`;
	const sepLine = `| ${headers.map(() => ":---").join(" | ")} |`;

	const bodyLines = items.map((item) => {
		const detailMap = new Map(
			(item.details ?? []).map((d) => [d.label, d.value]),
		);
		const cells = [
			`**${item.tier}**`,
			`**${item.name || "Untitled"}**`,
			item.category || "",
			item.summary || "",
			...detailLabels.map((lbl) => detailMap.get(lbl) || ""),
		];
		return `| ${cells.map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`;
	});

	return [headerLine, sepLine, ...bodyLines].join("\n");
}

export function TierListStudioInput(
	props: ObjectInputProps<StudioTierListValue>,
) {
	const { value, onChange } = props;
	const current: StudioTierListValue = value ?? { _type: "tierList" };
	const items: StudioTierItem[] = Array.isArray(current.items)
		? current.items
		: [];

	const [editingKey, setEditingKey] = useState<string | null>(null);
	const [showMarkdownModal, setShowMarkdownModal] = useState(false);
	const [markdownDraft, setMarkdownDraft] = useState("");
	const [filterTier, setFilterTier] = useState<TierRank | "ALL">("ALL");

	const updateRoot = (patch: Partial<StudioTierListValue>) => {
		onChange(
			set({
				...current,
				_type: "tierList",
				...patch,
			}),
		);
	};

	const updateItems = (nextItems: StudioTierItem[]) => {
		updateRoot({ items: nextItems });
	};

	const handleChangeItemTier = (itemKey: string, nextTier: TierRank) => {
		const next = items.map((it) =>
			it._key === itemKey ? { ...it, tier: nextTier } : it,
		);
		updateItems(next);
	};

	const handleUpdateItem = (
		itemKey: string,
		patch: Partial<StudioTierItem>,
	) => {
		const next = items.map((it) =>
			it._key === itemKey ? { ...it, ...patch } : it,
		);
		updateItems(next);
	};

	const handleDeleteItem = (itemKey: string) => {
		updateItems(items.filter((it) => it._key !== itemKey));
		if (editingKey === itemKey) {
			setEditingKey(null);
		}
	};

	const handleMoveItemWithinTier = (itemKey: string, dir: -1 | 1) => {
		const idx = items.findIndex((it) => it._key === itemKey);
		if (idx === -1) return;
		const targetTier = items[idx].tier;
		// Find previous or next item in the same tier
		let swapIdx = -1;
		for (
			let i = idx + dir;
			i >= 0 && i < items.length;
			i += dir
		) {
			if (items[i].tier === targetTier) {
				swapIdx = i;
				break;
			}
		}
		if (swapIdx === -1) return;
		const copy = [...items];
		const temp = copy[idx];
		copy[idx] = copy[swapIdx];
		copy[swapIdx] = temp;
		updateItems(copy);
	};

	const handleAddItem = (tier: TierRank = "S") => {
		const newKey = makeKey("ti");
		const newItem: StudioTierItem = {
			_key: newKey,
			_type: "tierItem",
			tier,
			name: "New Platform",
			category: "",
			summary: "",
			details: [
				{
					_key: makeKey("td"),
					_type: "tierDetail",
					label: "VM & Security Boundary",
					value: "",
				},
				{
					_key: makeKey("td"),
					_type: "tierDetail",
					label: "2026 Pricing & Quotas",
					value: "",
				},
			],
		};
		updateItems([newItem, ...items]);
		setEditingKey(newKey);
	};

	const handleOpenMarkdownModal = () => {
		setMarkdownDraft(serializeTierItemsToMarkdownTable(items));
		setShowMarkdownModal(true);
	};

	const handleApplyMarkdownImport = () => {
		const parsed = parseMarkdownTableToTierItems(markdownDraft);
		if (parsed.length > 0) {
			updateItems(parsed);
			setShowMarkdownModal(false);
		}
	};

	const grouped = useMemo(() => {
		const map: Record<TierRank, StudioTierItem[]> = {
			S: [],
			A: [],
			B: [],
			C: [],
			D: [],
		};
		for (const item of items) {
			const r = normalizeTierRank(item.tier);
			map[r].push(item);
		}
		return map;
	}, [items]);

	const visibleTiers =
		filterTier === "ALL" ? TIER_ORDER : [filterTier];

	return (
		<div
			style={{
				border: "2px solid #2A1155",
				borderRadius: "20px",
				background: "#0B1326",
				color: "#F8FAFC",
				overflow: "hidden",
				boxShadow: "3px 4px 0 #2A1155",
				fontFamily: "Inter, system-ui, sans-serif",
			}}
		>
			{/* Top Bar: Header + AJ Sticky Note Preview + Action Buttons */}
			<div
				style={{
					background: "#131B2E",
					borderBottom: "2px solid rgba(255,255,255,0.16)",
					padding: "16px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "center",
						justifyContent: "space-between",
						gap: "12px",
						marginBottom: "12px",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						<span
							style={{
								background: "#C5E86C",
								color: "#2A1155",
								fontWeight: 900,
								fontSize: "11px",
								padding: "3px 8px",
								borderRadius: "6px",
								letterSpacing: "0.06em",
								textTransform: "uppercase",
							}}
						>
							🏆 TIER LIST STUDIO
						</span>
						<span style={{ fontSize: "13px", color: "#CBD5E1", fontWeight: 600 }}>
							{items.length} Platforms Ranked
						</span>
					</div>

					<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
						<button
							type="button"
							onClick={() => handleAddItem("S")}
							style={{
								background: "#7C3AED",
								color: "#FFFFFF",
								border: "2px solid #2A1155",
								borderRadius: "10px",
								padding: "6px 12px",
								fontSize: "12px",
								fontWeight: 800,
								cursor: "pointer",
							}}
						>
							+ Add Platform
						</button>
						<button
							type="button"
							onClick={handleOpenMarkdownModal}
							style={{
								background: "#1E293B",
								color: "#E2E8F0",
								border: "1px solid rgba(255,255,255,0.25)",
								borderRadius: "10px",
								padding: "6px 12px",
								fontSize: "12px",
								fontWeight: 700,
								cursor: "pointer",
							}}
						>
							📋 Bulk Markdown Import / Export
						</button>
					</div>
				</div>

				{/* Editable Title, Subtitle & AJ Sticky-Note Comment */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
						gap: "10px",
					}}
				>
					<div>
						<label
							style={{
								display: "block",
								fontSize: "11px",
								fontWeight: 800,
								color: "#C084FC",
								textTransform: "uppercase",
								marginBottom: "4px",
							}}
						>
							Tier List Title
						</label>
						<input
							type="text"
							value={current.title ?? ""}
							placeholder="Alex's Architectural Tier List"
							onChange={(e) => updateRoot({ title: e.currentTarget.value })}
							style={{
								width: "100%",
								boxSizing: "border-box",
								background: "#0B1326",
								color: "#FFFFFF",
								border: "1px solid rgba(255,255,255,0.22)",
								borderRadius: "8px",
								padding: "7px 10px",
								fontSize: "13px",
								fontWeight: 700,
							}}
						/>
					</div>

					<div>
						<label
							style={{
								display: "block",
								fontSize: "11px",
								fontWeight: 800,
								color: "#FEF08A",
								textTransform: "uppercase",
								marginBottom: "4px",
							}}
						>
							🐾 AJ's Peeking Sticky-Note Comment
						</label>
						<input
							type="text"
							value={current.ajComment ?? ""}
							placeholder="I ranked all of them! Watch out for shared VMs... 👀🐾"
							onChange={(e) => updateRoot({ ajComment: e.currentTarget.value })}
							style={{
								width: "100%",
								boxSizing: "border-box",
								background: "#FEF08A",
								color: "#2A1155",
								border: "2px solid #2A1155",
								borderRadius: "8px",
								padding: "6px 10px",
								fontSize: "13px",
								fontWeight: 800,
							}}
						/>
					</div>
				</div>

				<div style={{ marginTop: "8px" }}>
					<label
						style={{
							display: "block",
							fontSize: "11px",
							fontWeight: 700,
							color: "#94A3B8",
							textTransform: "uppercase",
							marginBottom: "4px",
						}}
					>
						Subtitle / Ranking Criteria
					</label>
					<input
						type="text"
						value={current.subtitle ?? ""}
						placeholder="Ranked from S-Tier (Purrfect Production Pick) to D-Tier..."
						onChange={(e) => updateRoot({ subtitle: e.currentTarget.value })}
						style={{
							width: "100%",
							boxSizing: "border-box",
							background: "#0B1326",
							color: "#E2E8F0",
							border: "1px solid rgba(255,255,255,0.18)",
							borderRadius: "8px",
							padding: "6px 10px",
							fontSize: "12px",
						}}
					/>
				</div>

				{/* Quick Filter Bar */}
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "center",
						gap: "6px",
						marginTop: "12px",
					}}
				>
					<span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 700 }}>
						Filter Tier:
					</span>
					<button
						type="button"
						onClick={() => setFilterTier("ALL")}
						style={{
							background: filterTier === "ALL" ? "#7C3AED" : "#1E293B",
							color: "#FFFFFF",
							border: "1px solid rgba(255,255,255,0.2)",
							borderRadius: "6px",
							padding: "3px 8px",
							fontSize: "11px",
							fontWeight: 700,
							cursor: "pointer",
						}}
					>
						All ({items.length})
					</button>
					{TIER_ORDER.map((r) => (
						<button
							key={r}
							type="button"
							onClick={() => setFilterTier(r)}
							style={{
								background:
									filterTier === r ? TIER_CONFIG[r].bg : "#1E293B",
								color:
									filterTier === r ? TIER_CONFIG[r].text : "#E2E8F0",
								border: "1px solid rgba(255,255,255,0.2)",
								borderRadius: "6px",
								padding: "3px 8px",
								fontSize: "11px",
								fontWeight: 800,
								cursor: "pointer",
							}}
						>
							{r}-Tier ({grouped[r].length})
						</button>
					))}
				</div>
			</div>

			{/* Bulk Markdown Import / Export Drawer */}
			{showMarkdownModal && (
				<div
					style={{
						background: "#1E293B",
						borderBottom: "2px solid rgba(255,255,255,0.2)",
						padding: "16px",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "8px",
						}}
					>
						<strong style={{ fontSize: "13px", color: "#C5E86C" }}>
							Bulk Markdown Table Import / Export (`| Tier | Platform | Camp | Verdict | ... |`)
						</strong>
						<button
							type="button"
							onClick={() => setShowMarkdownModal(false)}
							style={{
								background: "transparent",
								color: "#94A3B8",
								border: "none",
								cursor: "pointer",
								fontSize: "13px",
								fontWeight: 700,
							}}
						>
							✕ Close
						</button>
					</div>
					<textarea
						rows={8}
						value={markdownDraft}
						onChange={(e) => setMarkdownDraft(e.currentTarget.value)}
						style={{
							width: "100%",
							boxSizing: "border-box",
							background: "#0B1326",
							color: "#F8FAFC",
							border: "1px solid rgba(255,255,255,0.25)",
							borderRadius: "8px",
							padding: "10px",
							fontFamily: "JetBrains Mono, monospace",
							fontSize: "11.5px",
							lineHeight: 1.45,
						}}
					/>
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							gap: "8px",
							marginTop: "8px",
						}}
					>
						<button
							type="button"
							onClick={() => setShowMarkdownModal(false)}
							style={{
								background: "#334155",
								color: "#E2E8F0",
								border: "none",
								borderRadius: "8px",
								padding: "6px 12px",
								fontSize: "12px",
								fontWeight: 700,
								cursor: "pointer",
							}}
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleApplyMarkdownImport}
							style={{
								background: "#C5E86C",
								color: "#2A1155",
								border: "2px solid #2A1155",
								borderRadius: "8px",
								padding: "6px 14px",
								fontSize: "12px",
								fontWeight: 900,
								cursor: "pointer",
							}}
						>
							✓ Apply Markdown Table to Tier Board
						</button>
					</div>
				</div>
			)}

			{/* Interactive S / A / B / C / D Tier Rows */}
			<div>
				{visibleTiers.map((tierKey) => {
					const cfg = TIER_CONFIG[tierKey];
					const tierItems = grouped[tierKey];

					return (
						<div
							key={tierKey}
							style={{
								display: "flex",
								borderBottom: "2px solid rgba(255,255,255,0.15)",
								minHeight: "88px",
							}}
						>
							{/* Left Tier Rank Badge */}
							<div
								style={{
									width: "105px",
									flexShrink: 0,
									background: cfg.bg,
									color: cfg.text,
									borderRight: "2px solid #2A1155",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									padding: "10px 6px",
									textAlign: "center",
								}}
							>
								<span
									style={{
										fontSize: "34px",
										fontWeight: 900,
										lineHeight: 1,
									}}
								>
									{cfg.rank}
								</span>
								<span
									style={{
										fontSize: "10px",
										fontWeight: 800,
										textTransform: "uppercase",
										marginTop: "3px",
									}}
								>
									{cfg.label}
								</span>
								<button
									type="button"
									onClick={() => handleAddItem(tierKey)}
									title={`Add platform to ${tierKey}-Tier`}
									style={{
										marginTop: "6px",
										background: "rgba(255,255,255,0.7)",
										color: "#2A1155",
										border: "1px solid #2A1155",
										borderRadius: "999px",
										padding: "2px 8px",
										fontSize: "10px",
										fontWeight: 800,
										cursor: "pointer",
									}}
								>
									+ Add {tierKey}
								</button>
							</div>

							{/* Right Tier Cards Container */}
							<div
								style={{
									flex: 1,
									padding: "10px",
									display: "flex",
									flexDirection: "column",
									gap: "8px",
								}}
							>
								{tierItems.length === 0 ? (
									<div
										style={{
											height: "100%",
											minHeight: "56px",
											border: "1px dashed rgba(255,255,255,0.2)",
											borderRadius: "10px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: "12px",
											color: "#64748B",
										}}
									>
										No items in {tierKey}-Tier. Click "+ Add {tierKey}" or move an item here using its [S][A][B][C][D] buttons.
									</div>
								) : (
									tierItems.map((item) => {
										const isEditing = editingKey === item._key;

										return (
											<div
												key={item._key}
												style={{
													background: isEditing ? "#1E293B" : "#131B2E",
													border: isEditing
														? "2px solid #C084FC"
														: "1px solid rgba(255,255,255,0.18)",
													borderRadius: "12px",
													padding: "10px 12px",
												}}
											>
												{/* Compact Card Header Row */}
												<div
													style={{
														display: "flex",
														flexWrap: "wrap",
														alignItems: "center",
														justifyContent: "space-between",
														gap: "8px",
													}}
												>
													<div
														style={{
															display: "flex",
															flexWrap: "wrap",
															alignItems: "center",
															gap: "8px",
															flex: 1,
														}}
													>
														{/* Instant 1-Click Tier Rank Switcher */}
														<div
															style={{
																display: "inline-flex",
																gap: "2px",
																background: "#0B1326",
																padding: "2px",
																borderRadius: "6px",
																border: "1px solid rgba(255,255,255,0.15)",
															}}
															title="Click to move to another tier"
														>
															{TIER_ORDER.map((r) => {
																const active = item.tier === r;
																return (
																	<button
																		key={r}
																		type="button"
																		onClick={() =>
																			handleChangeItemTier(item._key, r)
																		}
																		style={{
																			background: active
																				? TIER_CONFIG[r].bg
																				: "transparent",
																			color: active
																				? TIER_CONFIG[r].text
																				: "#94A3B8",
																			border: "none",
																			borderRadius: "4px",
																			width: "22px",
																			height: "22px",
																			fontSize: "11px",
																			fontWeight: 900,
																			cursor: "pointer",
																		}}
																	>
																		{r}
																	</button>
																);
															})}
														</div>

														<strong
															style={{
																fontSize: "14px",
																color: "#FFFFFF",
																cursor: "pointer",
															}}
															onClick={() =>
																setEditingKey(isEditing ? null : item._key)
															}
														>
															{item.name || "Untitled Platform"}
														</strong>

														{item.category && (
															<span
																style={{
																	background: "rgba(124, 58, 237, 0.25)",
																	border: "1px solid rgba(192, 132, 252, 0.4)",
																	color: "#E9D5FF",
																	fontSize: "11px",
																	fontWeight: 700,
																	padding: "1px 8px",
																	borderRadius: "999px",
																}}
															>
																{item.category}
															</span>
														)}
													</div>

													{/* Reorder & Edit Controls */}
													<div
														style={{
															display: "flex",
															alignItems: "center",
															gap: "4px",
														}}
													>
														<button
															type="button"
															onClick={() =>
																handleMoveItemWithinTier(item._key, -1)
															}
															title="Move up in tier"
															style={{
																background: "#0B1326",
																color: "#CBD5E1",
																border: "1px solid rgba(255,255,255,0.15)",
																borderRadius: "6px",
																padding: "3px 7px",
																fontSize: "11px",
																cursor: "pointer",
															}}
														>
															↑
														</button>
														<button
															type="button"
															onClick={() =>
																handleMoveItemWithinTier(item._key, 1)
															}
															title="Move down in tier"
															style={{
																background: "#0B1326",
																color: "#CBD5E1",
																border: "1px solid rgba(255,255,255,0.15)",
																borderRadius: "6px",
																padding: "3px 7px",
																fontSize: "11px",
																cursor: "pointer",
															}}
														>
															↓
														</button>
														<button
															type="button"
															onClick={() =>
																setEditingKey(isEditing ? null : item._key)
															}
															style={{
																background: isEditing ? "#7C3AED" : "#0B1326",
																color: "#FFFFFF",
																border: "1px solid rgba(255,255,255,0.22)",
																borderRadius: "6px",
																padding: "3px 10px",
																fontSize: "11px",
																fontWeight: 700,
																cursor: "pointer",
															}}
														>
															{isEditing ? "Done" : "✏️ Edit"}
														</button>
														<button
															type="button"
															onClick={() => handleDeleteItem(item._key)}
															title="Remove platform"
															style={{
																background: "rgba(239, 68, 68, 0.15)",
																color: "#FCA5A5",
																border: "1px solid rgba(239, 68, 68, 0.35)",
																borderRadius: "6px",
																padding: "3px 7px",
																fontSize: "11px",
																fontWeight: 700,
																cursor: "pointer",
															}}
														>
															✕
														</button>
													</div>
												</div>

												{/* Concise Verdict Preview when Collapsed */}
												{!isEditing && item.summary && (
													<p
														style={{
															margin: "6px 0 0 0",
															fontSize: "12px",
															color: "#CBD5E1",
															lineHeight: 1.4,
														}}
													>
														{item.summary}
													</p>
												)}

												{/* Expanded Inline Form Drawer */}
												{isEditing && (
													<div
														style={{
															marginTop: "10px",
															paddingTop: "10px",
															borderTop: "1px dashed rgba(255,255,255,0.2)",
															display: "flex",
															flexDirection: "column",
															gap: "8px",
														}}
													>
														<div
															style={{
																display: "grid",
																gridTemplateColumns:
																	"repeat(auto-fit, minmax(180px, 1fr))",
																gap: "8px",
															}}
														>
															<div>
																<label
																	style={{
																		display: "block",
																		fontSize: "10px",
																		fontWeight: 800,
																		color: "#C084FC",
																		textTransform: "uppercase",
																		marginBottom: "3px",
																	}}
																>
																	Platform Name
																</label>
																<input
																	type="text"
																	value={item.name ?? ""}
																	onChange={(e) =>
																		handleUpdateItem(item._key, {
																			name: e.currentTarget.value,
																		})
																	}
																	style={{
																		width: "100%",
																		boxSizing: "border-box",
																		background: "#0B1326",
																		color: "#FFFFFF",
																		border: "1px solid rgba(255,255,255,0.25)",
																		borderRadius: "6px",
																		padding: "5px 8px",
																		fontSize: "12px",
																		fontWeight: 700,
																	}}
																/>
															</div>

															<div>
																<label
																	style={{
																		display: "block",
																		fontSize: "10px",
																		fontWeight: 800,
																		color: "#C084FC",
																		textTransform: "uppercase",
																		marginBottom: "3px",
																	}}
																>
																	Category / Camp Pill
																</label>
																<input
																	type="text"
																	value={item.category ?? ""}
																	placeholder="e.g., 2. Cloud Fleet"
																	onChange={(e) =>
																		handleUpdateItem(item._key, {
																			category: e.currentTarget.value,
																		})
																	}
																	style={{
																		width: "100%",
																		boxSizing: "border-box",
																		background: "#0B1326",
																		color: "#FFFFFF",
																		border: "1px solid rgba(255,255,255,0.25)",
																		borderRadius: "6px",
																		padding: "5px 8px",
																		fontSize: "12px",
																	}}
																/>
															</div>

															<div>
																<label
																	style={{
																		display: "block",
																		fontSize: "10px",
																		fontWeight: 800,
																		color: "#C084FC",
																		textTransform: "uppercase",
																		marginBottom: "3px",
																	}}
																>
																	Optional Link URL
																</label>
																<input
																	type="url"
																	value={item.url ?? ""}
																	placeholder="https://..."
																	onChange={(e) =>
																		handleUpdateItem(item._key, {
																			url: e.currentTarget.value,
																		})
																	}
																	style={{
																		width: "100%",
																		boxSizing: "border-box",
																		background: "#0B1326",
																		color: "#FFFFFF",
																		border: "1px solid rgba(255,255,255,0.25)",
																		borderRadius: "6px",
																		padding: "5px 8px",
																		fontSize: "12px",
																	}}
																/>
															</div>
														</div>

														<div>
															<label
																style={{
																	display: "block",
																	fontSize: "10px",
																	fontWeight: 800,
																	color: "#C5E86C",
																	textTransform: "uppercase",
																	marginBottom: "3px",
																}}
															>
																Alex's Architectural Verdict
															</label>
															<textarea
																rows={2}
																value={item.summary ?? ""}
																onChange={(e) =>
																	handleUpdateItem(item._key, {
																		summary: e.currentTarget.value,
																	})
																}
																style={{
																	width: "100%",
																	boxSizing: "border-box",
																	background: "#0B1326",
																	color: "#FFFFFF",
																	border: "1px solid rgba(255,255,255,0.25)",
																	borderRadius: "6px",
																	padding: "6px 8px",
																	fontSize: "12px",
																}}
															/>
														</div>

														{/* Key-Value Specs List */}
														<div>
															<div
																style={{
																	display: "flex",
																	justifyContent: "space-between",
																	alignItems: "center",
																	marginBottom: "4px",
																}}
															>
																<span
																	style={{
																		fontSize: "10px",
																		fontWeight: 800,
																		color: "#94A3B8",
																		textTransform: "uppercase",
																	}}
																>
																	Additional Specs (VM & Security, Memory, Pricing)
																</span>
																<button
																	type="button"
																	onClick={() => {
																		const nextDetails: StudioTierDetail[] = [
																			...(item.details ?? []),
																			{
																				_key: makeKey("td"),
																				_type: "tierDetail",
																				label: "Spec",
																				value: "",
																			},
																		];
																		handleUpdateItem(item._key, {
																			details: nextDetails,
																		});
																	}}
																	style={{
																		background: "#0B1326",
																		color: "#C5E86C",
																		border:
																			"1px solid rgba(197, 232, 108, 0.4)",
																		borderRadius: "6px",
																		padding: "2px 8px",
																		fontSize: "10px",
																		fontWeight: 800,
																		cursor: "pointer",
																	}}
																>
																	+ Add Spec Line
																</button>
															</div>

															<div
																style={{
																	display: "flex",
																	flexDirection: "column",
																	gap: "4px",
																}}
															>
																{(item.details ?? []).map((det, dIdx) => (
																	<div
																		key={det._key || dIdx}
																		style={{
																			display: "flex",
																			gap: "6px",
																			alignItems: "center",
																		}}
																	>
																		<input
																			type="text"
																			value={det.label}
																			placeholder="Label (e.g. Pricing)"
																			onChange={(e) => {
																				const nextDetails = [
																					...(item.details ?? []),
																				];
																				nextDetails[dIdx] = {
																					...det,
																					label: e.currentTarget.value,
																				};
																				handleUpdateItem(item._key, {
																					details: nextDetails,
																				});
																			}}
																			style={{
																				width: "160px",
																				background: "#0B1326",
																				color: "#C084FC",
																				border:
																					"1px solid rgba(255,255,255,0.2)",
																				borderRadius: "6px",
																				padding: "4px 6px",
																				fontSize: "11px",
																				fontWeight: 700,
																			}}
																		/>
																		<input
																			type="text"
																			value={det.value}
																			placeholder="Value"
																			onChange={(e) => {
																				const nextDetails = [
																					...(item.details ?? []),
																				];
																				nextDetails[dIdx] = {
																					...det,
																					value: e.currentTarget.value,
																				};
																				handleUpdateItem(item._key, {
																					details: nextDetails,
																				});
																			}}
																			style={{
																				flex: 1,
																				background: "#0B1326",
																				color: "#F8FAFC",
																				border:
																					"1px solid rgba(255,255,255,0.2)",
																				borderRadius: "6px",
																				padding: "4px 6px",
																				fontSize: "11px",
																			}}
																		/>
																		<button
																			type="button"
																			onClick={() => {
																				const nextDetails = (
																					item.details ?? []
																				).filter((_, i) => i !== dIdx);
																				handleUpdateItem(item._key, {
																					details: nextDetails,
																				});
																			}}
																			style={{
																				background: "transparent",
																				color: "#FCA5A5",
																				border: "none",
																				cursor: "pointer",
																				fontSize: "12px",
																			}}
																		>
																			✕
																		</button>
																	</div>
																))}
															</div>
														</div>
													</div>
												)}
											</div>
										);
									})
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
export default TierListStudioInput;
