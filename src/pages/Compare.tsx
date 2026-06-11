import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import { resolveTier } from "../data/tiers";
import { resolveToolDetail } from "../utils/toolDetail";
import { slugify } from "../utils/slug";
import ToolLogo from "../components/ToolLogo";
import TierBadge from "../components/TierBadge";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";
import type { Pricing, Tool } from "../types";

/**
 * Compare view: pin up to three tools side-by-side to teach "which is
 * best" as a set of tradeoffs rather than a single winner.
 */
interface Entry {
  key: string;
  tool: Tool;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
}

const pricingClass: Record<Pricing, string> = {
  Free: "tag-free",
  Freemium: "tag-freemium",
  Paid: "tag-paid",
  "Open Source": "tag-open",
};

const MAX = 3;

// flatten every tool once, with its category context
const allEntries: Entry[] = categories.flatMap((c) =>
  c.tools.map((tool) => ({
    key: `${c.id}/${slugify(tool.name)}`,
    tool,
    categoryId: c.id,
    categoryName: c.name,
    categoryIcon: c.icon,
  }))
);

export default function Compare() {
  const ready = usePageReady();
  const [selected, setSelected] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allEntries
      .filter(
        (e) =>
          e.tool.name.toLowerCase().includes(q) ||
          e.categoryName.toLowerCase().includes(q)
      )
      .filter((e) => !selected.some((s) => s.key === e.key))
      .slice(0, 6);
  }, [query, selected]);

  const add = (entry: Entry) => {
    if (selected.length >= MAX) return;
    setSelected((s) => [...s, entry]);
    setQuery("");
  };

  const remove = (key: string) =>
    setSelected((s) => s.filter((e) => e.key !== key));

  if (!ready) return <SkeletonGrid count={3} variant="tool" />;

  return (
    <div className="fade-up">
      <header className="section-head">
        <h1>Compare tools ⚖️</h1>
        <p>
          Put up to {MAX} tools head-to-head. There&apos;s rarely one
          &ldquo;best&rdquo; tool, only the best fit for the job.
        </p>
      </header>

      {/* picker */}
      <div className="search-bar" style={{ marginBottom: "1rem" }}>
        <span className="search-bar__icon" aria-hidden="true">
          ➕
        </span>
        <input
          type="text"
          className="search-bar__input"
          placeholder={
            selected.length >= MAX
              ? "Remove one to add another…"
              : "Add a tool to compare… (e.g. Cursor, Suno)"
          }
          value={query}
          disabled={selected.length >= MAX}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Add a tool to compare"
        />
        {query && (
          <button
            className="search-bar__clear"
            onClick={() => setQuery("")}
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {matches.length > 0 && (
        <div className="compare-suggestions">
          {matches.map((e) => (
            <button key={e.key} className="chip" onClick={() => add(e)}>
              {e.categoryIcon} {e.tool.name}
            </button>
          ))}
        </div>
      )}

      {selected.length === 0 ? (
        <div className="empty-state sketch-box">
          <span className="empty-state__emoji">⚖️</span>
          <h2>Pick some tools to compare</h2>
          <p>
            Try comparing Midjourney vs Flux, or Cursor vs GitHub Copilot, then
            talk through the tradeoffs.
          </p>
        </div>
      ) : (
        <div className="compare-grid" data-count={selected.length}>
          {selected.map((e) => {
            const detail = resolveToolDetail(e.tool, e.categoryId);
            const tier = resolveTier(e.tool);
            return (
              <div key={e.key} className="sketch-box compare-col">
                <button
                  className="compare-col__remove"
                  onClick={() => remove(e.key)}
                  aria-label={`Remove ${e.tool.name}`}
                >
                  ✕
                </button>
                <div className="compare-col__head">
                  <ToolLogo name={e.tool.name} size={72} />
                  <h2 className="compare-col__name">{e.tool.name}</h2>
                </div>

                <CompareRow label="Strength">
                  <TierBadge tier={tier} />
                </CompareRow>
                <CompareRow label="Pricing">
                  <span className={`sketch-tag ${pricingClass[e.tool.pricing]}`}>
                    {e.tool.pricing}
                  </span>
                </CompareRow>
                <CompareRow label="Category">
                  {e.categoryIcon} {e.categoryName}
                </CompareRow>
                <CompareRow label="Maker">{detail.maker}</CompareRow>
                <CompareRow label="Since">{detail.founded}</CompareRow>
                <CompareRow label="What it's good at">
                  {e.tool.description}
                </CompareRow>
                <CompareRow label="How you prompt it">
                  {detail.promptStyle}
                </CompareRow>

                <div className="compare-col__actions">
                  <Link
                    to={`/category/${e.categoryId}/${slugify(e.tool.name)}`}
                    className="sketch-btn sketch-btn--ghost"
                  >
                    Details
                  </Link>
                  <a
                    className="tool-card__ext"
                    href={e.tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="compare-row">
      <span className="compare-row__label">{label}</span>
      <span className="compare-row__value">{children}</span>
    </div>
  );
}
