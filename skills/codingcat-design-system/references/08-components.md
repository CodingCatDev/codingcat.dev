# 08. Components: Astro, React & Tailwind Reference Patterns

Use these production-ready Astro / React + Tailwind CSS patterns for all CodingCat.dev interfaces.

## 1. Primary CTA Button (Electric Lime `#C5E86C`)
High-contrast `#C5E86C` surface, `#0F172A` bold text, tactile bottom lip, and `--cc-glow-lime` hover state.

```tsx
export function PrimaryButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const classes =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#C5E86C] px-5 py-2.5 font-sans text-sm font-bold text-[#0F172A] border-b-4 border-[#9BC53D] shadow-[var(--cc-glow-lime)] transition-all hover:brightness-105 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5E86C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]";

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
```

## 2. Secondary Purple Button (`#4B2E83`)
Royal Purple `#4B2E83` background, `#F8FAFC` text, `#B4A7D6`/30 border, and subtle purple glow on hover.

```tsx
export function SecondaryPurpleButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const classes =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#4B2E83] px-5 py-2.5 font-sans text-sm font-semibold text-[#F8FAFC] border border-[#B4A7D6]/30 border-b-4 border-b-[#351F5E] transition-all hover:bg-[#4B2E83]/90 hover:border-[#B4A7D6]/60 hover:shadow-[var(--cc-glow-purple)] active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5E86C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]";

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
```

## 3. Bento Tutorial Card (`#1E293B` Surface)
`rounded-2xl` Surface Slate card with concentric `rounded-xl` 16:9 thumbnail slot, `JetBrains Mono` tag pills, and metadata footer.

```tsx
export interface BentoTutorialCardProps {
  title: string;
  excerpt: string;
  href: string;
  thumbnailUrl: string;
  tags: string[];
  publishedAt: string;
  readingTime: string;
}

export function BentoTutorialCard({
  title,
  excerpt,
  href,
  thumbnailUrl,
  tags,
  publishedAt,
  readingTime,
}: BentoTutorialCardProps) {
  return (
    <a
      href={href}
      className="group flex flex-col rounded-2xl bg-[#1E293B] p-6 border border-[#B4A7D6]/15 shadow-[var(--cc-shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-[#B4A7D6]/45 hover:shadow-[var(--cc-glow-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5E86C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
    >
      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-[#0F172A] border border-[#B4A7D6]/10">
        <img
          src={thumbnailUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-[#4B2E83]/40 px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-[#B4A7D6] border border-[#B4A7D6]/20"
          >
            {tag}
          </span>
        ))}
      </div>

      <h3 className="mb-2 font-sans text-xl font-bold tracking-tight text-[#F8FAFC] group-hover:text-[#C5E86C] transition-colors">
        {title}
      </h3>

      <p className="mb-6 flex-1 font-sans text-sm leading-relaxed text-[#94A3B8]">
        {excerpt}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-[#B4A7D6]/10 pt-4 font-mono text-xs text-[#94A3B8]">
        <span>{publishedAt}</span>
        <span className="text-[#C5E86C]">{readingTime}</span>
      </div>
    </a>
  );
}
```

## 4. AJ Callout / Pro-Tip Box
Left border accent in Electric Lime (`#C5E86C`) or Soft Lavender (`#B4A7D6`), `#1E293B`/80 surface, and a slot for AJ's canonical headphone emblem (`assets/AJHeadphones.png`).

```tsx
export function AJCalloutBox({
  title = "AJ's Purrfect Pro-Tip",
  variant = "lime",
  children,
}: {
  title?: string;
  variant?: "lime" | "lavender";
  children: React.ReactNode;
}) {
  const accentBorder =
    variant === "lime" ? "border-l-[#C5E86C]" : "border-l-[#B4A7D6]";
  const titleColor =
    variant === "lime" ? "text-[#C5E86C]" : "text-[#B4A7D6]";

  return (
    <aside
      className={`my-6 flex items-start gap-4 rounded-xl bg-[#1E293B]/80 p-6 border border-[#B4A7D6]/15 border-l-4 ${accentBorder} shadow-[var(--cc-shadow-card)]`}
    >
      <img
        src="/assets/AJHeadphones.png"
        alt="AJ the CodingCat Mascot"
        className="h-12 w-12 shrink-0 rounded-full bg-[#0F172A] p-1 border border-[#B4A7D6]/30 object-contain"
      />
      <div className="space-y-1.5">
        <p className={`font-display text-base font-extrabold ${titleColor}`}>
          {title}
        </p>
        <div className="font-sans text-sm leading-relaxed text-[#F8FAFC]">
          {children}
        </div>
      </div>
    </aside>
  );
}
```

## 5. Comparison Table Component
Because Alex Patterson always uses tables for comparisons, use this styled dark table with a `#0F172A` header, `#1E293B` alternating rows, and `#C5E86C` / `#FCA5A5` highlights.

```tsx
export interface ComparisonRow {
  feature: string;
  recommended: string;
  alternative: string;
}

export function ComparisonTable({
  recommendedLabel,
  alternativeLabel,
  rows,
}: {
  recommendedLabel: string;
  alternativeLabel: string;
  rows: ComparisonRow[];
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-[#B4A7D6]/20 shadow-[var(--cc-shadow-card)]">
      <table className="w-full border-collapse text-left font-sans text-sm">
        <thead>
          <tr className="border-b border-[#B4A7D6]/20 bg-[#0F172A] font-mono text-xs uppercase tracking-wider">
            <th className="py-3.5 px-4 text-[#94A3B8]">Dimension / Feature</th>
            <th className="py-3.5 px-4 text-[#C5E86C]">{recommendedLabel}</th>
            <th className="py-3.5 px-4 text-[#B4A7D6]">{alternativeLabel}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#B4A7D6]/10 bg-[#1E293B]">
          {rows.map((row, idx) => (
            <tr
              key={row.feature}
              className={idx % 2 === 1 ? "bg-[#0F172A]/40" : "bg-[#1E293B]"}
            >
              <td className="py-3 px-4 font-semibold text-[#F8FAFC]">
                {row.feature}
              </td>
              <td className="py-3 px-4 font-mono text-xs text-[#86EFAC]">
                {row.recommended}
              </td>
              <td className="py-3 px-4 font-mono text-xs text-[#94A3B8]">
                {row.alternative}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```
