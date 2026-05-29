"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Plus, Trash2, X } from "lucide-react";
import type { EngineConfig } from "@/lib/types/engine-config";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface ConfigFormProps {
  initialConfig: EngineConfig;
}

export function ConfigForm({ initialConfig }: ConfigFormProps) {
  const [config, setConfig] = useState<EngineConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const update = <K extends keyof EngineConfig>(key: K, value: EngineConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        toast.success("Config saved. Changes propagate within 5 minutes.");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save config");
      }
    } catch {
      toast.error("Failed to save config");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: string) => {
    const days = config.publishDays || [];
    update(
      "publishDays",
      days.includes(day) ? days.filter((d) => d !== day) : [...days, day]
    );
  };

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed || (config.contentCategories || []).includes(trimmed)) return;
    update("contentCategories", [...(config.contentCategories || []), trimmed]);
    setNewCategory("");
  };

  const removeCategory = (cat: string) => {
    update(
      "contentCategories",
      (config.contentCategories || []).filter((c) => c !== cat)
    );
  };

  const updateTier = (
    index: number,
    field: "name" | "description" | "price",
    value: string | number
  ) => {
    const tiers = [...(config.rateCardTiers || [])];
    tiers[index] = { ...tiers[index], [field]: value };
    update("rateCardTiers", tiers);
  };

  const addTier = () => {
    update("rateCardTiers", [
      ...(config.rateCardTiers || []),
      { name: "", description: "", price: 0 },
    ]);
  };

  const removeTier = (index: number) => {
    update(
      "rateCardTiers",
      (config.rateCardTiers || []).filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Control */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Control</CardTitle>
          <CardDescription>
            Control auto-publishing, quality gates, and pipeline limits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoPublish">Auto-publish approved videos</Label>
            <button
              id="autoPublish"
              type="button"
              role="switch"
              aria-checked={config.autoPublish}
              onClick={() => update("autoPublish", !config.autoPublish)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                config.autoPublish ? "bg-primary" : "bg-input"
              }`}
            >
              <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                  config.autoPublish ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualityThreshold">
              Quality Threshold: {config.qualityThreshold ?? 70}
            </Label>
            <input
              id="qualityThreshold"
              type="range"
              min={0}
              max={100}
              value={config.qualityThreshold ?? 70}
              onChange={(e) =>
                update("qualityThreshold", Number(e.target.value))
              }
              className="w-full accent-primary"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reviewTimeoutDays">Review Timeout (days)</Label>
              <Input
                id="reviewTimeoutDays"
                type="number"
                min={1}
                max={30}
                value={config.reviewTimeoutDays ?? 3}
                onChange={(e) =>
                  update("reviewTimeoutDays", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxIdeasPerRun">Max Ideas Per Run</Label>
              <Input
                id="maxIdeasPerRun"
                type="number"
                min={1}
                max={50}
                value={config.maxIdeasPerRun ?? 5}
                onChange={(e) =>
                  update("maxIdeasPerRun", Number(e.target.value))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Cadence */}
      <Card>
        <CardHeader>
          <CardTitle>Content Cadence</CardTitle>
          <CardDescription>
            How much content to produce and when to publish.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="longFormPerWeek">Long-form / week</Label>
              <Input
                id="longFormPerWeek"
                type="number"
                min={0}
                max={7}
                value={config.longFormPerWeek ?? 1}
                onChange={(e) =>
                  update("longFormPerWeek", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortsPerDay">Shorts / day</Label>
              <Input
                id="shortsPerDay"
                type="number"
                min={0}
                max={10}
                value={config.shortsPerDay ?? 0}
                onChange={(e) =>
                  update("shortsPerDay", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blogsPerWeek">Blogs / week</Label>
              <Input
                id="blogsPerWeek"
                type="number"
                min={0}
                max={14}
                value={config.blogsPerWeek ?? 0}
                onChange={(e) =>
                  update("blogsPerWeek", Number(e.target.value))
                }
              />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Publish Days</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => (
                <Badge
                  key={day}
                  variant={
                    (config.publishDays || []).includes(day)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer select-none transition-colors min-h-[32px] px-3"
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </Badge>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Content Categories</Label>
            <div className="flex flex-wrap gap-2">
              {(config.contentCategories || []).map((cat) => (
                <Badge key={cat} variant="secondary" className="group gap-1 pr-1">
                  {cat}
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="ml-0.5 rounded-full p-0.5 opacity-50 hover:opacity-100"
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
                className="min-h-[44px]"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI & Generation */}
      <Card>
        <CardHeader>
          <CardTitle>AI & Generation</CardTitle>
          <CardDescription>
            Model selection and system instructions for content generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="geminiModel">Gemini Model</Label>
              <Input
                id="geminiModel"
                value={config.geminiModel ?? ""}
                onChange={(e) => update("geminiModel", e.target.value)}
                placeholder="gemini-2.0-flash"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="infographicModel">Infographic Model</Label>
              <Input
                id="infographicModel"
                value={config.infographicModel ?? ""}
                onChange={(e) => update("infographicModel", e.target.value)}
                placeholder="imagen-3.0-generate-002"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="systemInstruction">System Instruction</Label>
            <Textarea
              id="systemInstruction"
              value={config.systemInstruction ?? ""}
              onChange={(e) => update("systemInstruction", e.target.value)}
              rows={6}
              placeholder="System instruction for the AI model..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
          <CardDescription>
            Platform toggles and publishing settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {(
              [
                ["youtubeEnabled", "YouTube"],
                ["twitterEnabled", "Twitter/X"],
                ["linkedinEnabled", "LinkedIn"],
                ["tiktokEnabled", "TikTok"],
                ["instagramEnabled", "Instagram"],
                ["blueskyEnabled", "Bluesky"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between rounded-md border p-3">
                <Label>{label}</Label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!config[key]}
                  onClick={() => update(key, !config[key] as any)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    config[key] ? "bg-primary" : "bg-input"
                  }`}
                >
                  <span
                    className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                      config[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtubeUploadVisibility">YouTube Upload Visibility</Label>
            <select
              id="youtubeUploadVisibility"
              value={config.youtubeUploadVisibility ?? "private"}
              onChange={(e) => update("youtubeUploadVisibility", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notificationEmails">Notification Emails (comma-separated)</Label>
            <Input
              id="notificationEmails"
              value={(config.notificationEmails || []).join(", ")}
              onChange={(e) =>
                update(
                  "notificationEmails",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              placeholder="admin@codingcat.dev"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sponsor */}
      <Card>
        <CardHeader>
          <CardTitle>Sponsor Settings</CardTitle>
          <CardDescription>
            Sponsor outreach and rate card configuration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cooldownDays">Cooldown Days</Label>
              <Input
                id="cooldownDays"
                type="number"
                min={0}
                max={90}
                value={config.cooldownDays ?? 14}
                onChange={(e) => update("cooldownDays", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxOutreachPerRun">Max Outreach Per Run</Label>
              <Input
                id="maxOutreachPerRun"
                type="number"
                min={1}
                max={100}
                value={config.maxOutreachPerRun ?? 10}
                onChange={(e) =>
                  update("maxOutreachPerRun", Number(e.target.value))
                }
              />
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label>Rate Card Tiers</Label>
            {(config.rateCardTiers || []).map((tier, index) => (
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
                        min={0}
                        value={tier.price}
                        onChange={(e) =>
                          updateTier(index, "price", Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTier(index)}
                  className="min-h-[44px] min-w-[44px] text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTier}
              className="min-h-[44px]"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Tier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Brand */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
          <CardDescription>
            Colors used in generated infographics and video overlays.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="brandPrimary">Primary</Label>
              <div className="flex items-center gap-2">
                <input
                  id="brandPrimary"
                  type="color"
                  value={config.brandPrimary || "#6d28d9"}
                  onChange={(e) => update("brandPrimary", e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border"
                />
                <Input
                  value={config.brandPrimary || "#6d28d9"}
                  onChange={(e) => update("brandPrimary", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandBackground">Background</Label>
              <div className="flex items-center gap-2">
                <input
                  id="brandBackground"
                  type="color"
                  value={config.brandBackground || "#0f172a"}
                  onChange={(e) => update("brandBackground", e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border"
                />
                <Input
                  value={config.brandBackground || "#0f172a"}
                  onChange={(e) => update("brandBackground", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandText">Text</Label>
              <div className="flex items-center gap-2">
                <input
                  id="brandText"
                  type="color"
                  value={config.brandText || "#f8fafc"}
                  onChange={(e) => update("brandText", e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border"
                />
                <Input
                  value={config.brandText || "#f8fafc"}
                  onChange={(e) => update("brandText", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="sticky bottom-4 flex justify-end">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={saving}
          className="min-h-[44px] shadow-lg"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Config
        </Button>
      </div>
    </div>
  );
}
