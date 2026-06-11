import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { categories } from "../data/categories";
import { resolveTier, sortToolsByTier } from "../data/tiers";
import { TIERS_LAST_REVIEWED, RANKING_METHODOLOGY } from "../config";
import ToolCard from "../components/ToolCard";
import { SkeletonGrid } from "../components/Skeleton";
import { usePageReady } from "../hooks/usePageReady";

type Filter = "all" | "top" | "strong" | "free" | "open";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "top", label: "🔥 Top picks" },
  { key: "strong", label: "⭐ Strong" },
  { key: "free", label: "🆓 Free" },
  { key: "open", label: "🔓 Open source" },
];

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const category = categories.find((c) => c.id === id);

  // reset the skeleton whenever we switch between categories
  const ready = usePageReady(650, [id]);
  const [filter, setFilter] = useState<Filter>("all");

  // tools repositioned strongest-first, then filtered
  const sorted = useMemo(
    () => (category ? sortToolsByTier(category) : []),
    [category]
  );

  const visible = useMemo(() => {
    return sorted.filter((t) => {
      switch (filter) {
        case "top":
          return resolveTier(t) === "top";
        case "strong":
          return resolveTier(t) === "strong";
        case "free":
          return t.pricing === "Free" || t.pricing === "Freemium";
        case "open":
          return t.pricing === "Open Source";
        default:
          return true;
      }
    });
  }, [sorted, filter]);

  if (!category) {
    return (
      <div className="section-head fade-up">
        <h1>Hmm, nothing sketched here 🤔</h1>
        <p>That category doesn&apos;t exist.</p>
        <Link to="/home" className="back-link">
          Back to categories
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/home" className="back-link">
        All categories
      </Link>

      <header className="section-head fade-up">
        <h1>
          <span style={{ marginRight: "0.4rem" }}>{category.icon}</span>
          {category.name}
        </h1>
        <p>{category.tagline}</p>
        <details className="ranking-info">
          <summary>
            Ranked by popularity &amp; quality &middot; reviewed{" "}
            {TIERS_LAST_REVIEWED}
          </summary>
          <p>{RANKING_METHODOLOGY}</p>
        </details>
      </header>

      {ready && (
        <div className="filter-row fade-up">
          {filters.map((f) => (
            <button
              key={f.key}
              className={"filter-chip" + (filter === f.key ? " active" : "")}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {!ready ? (
        <SkeletonGrid count={9} variant="tool" />
      ) : visible.length === 0 ? (
        <div className="empty-state sketch-box fade-up">
          <span className="empty-state__emoji">🔍</span>
          <h2>No tools match this filter</h2>
          <p>Try another filter to see more options.</p>
          <button className="sketch-btn" onClick={() => setFilter("all")}>
            Show all
          </button>
        </div>
      ) : (
        <div className="tool-grid fade-up">
          {visible.map((tool) => (
            <ToolCard key={tool.name} tool={tool} categoryId={category.id} />
          ))}
        </div>
      )}
    </div>
  );
}
