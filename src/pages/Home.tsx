import { useMemo, useState } from "react";
import { categories } from "../data/categories";
import CategoryCard from "../components/CategoryCard";
import StatTile from "../components/StatTile";
import { SkeletonGrid } from "../components/Skeleton";
import { usePageReady } from "../hooks/usePageReady";

export default function Home() {
  const ready = usePageReady(650);
  const [query, setQuery] = useState("");

  const totalTools = useMemo(
    () => categories.reduce((sum, c) => sum + c.tools.length, 0),
    []
  );

  // filter categories by name, tagline OR any tool name inside them
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => {
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.tagline.toLowerCase().includes(q)) return true;
      return c.tools.some((t) => t.name.toLowerCase().includes(q));
    });
  }, [query]);

  return (
    <div>
      <header className="section-head fade-up">
        <h1>Browse by Category</h1>
        <p>Pick a shelf and start digging. Or search for a specific tool.</p>
      </header>

      {ready && (
        <div className="home-stats fade-up">
          <StatTile value={categories.length} label="categories" delay={0} />
          <StatTile value={totalTools} label="tools" suffix="+" delay={100} />
          <StatTile value={4} label="pricing tiers" delay={200} />
        </div>
      )}

      <div className="search-bar fade-up">
        <span className="search-bar__icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search categories or tools… (e.g. Midjourney, coding)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search categories or tools"
        />
        {query && (
          <button
            className="search-bar__clear"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {!ready ? (
        <SkeletonGrid count={8} variant="category" />
      ) : results.length === 0 ? (
        <div className="empty-state sketch-box fade-up">
          <span className="empty-state__emoji">🤷</span>
          <h2>No matches for &ldquo;{query}&rdquo;</h2>
          <p>Try a different word, or clear the search to see everything.</p>
          <button className="sketch-btn" onClick={() => setQuery("")}>
            Show all categories
          </button>
        </div>
      ) : (
        <>
          {query && (
            <p className="results-count fade-up">
              {results.length} categor{results.length === 1 ? "y" : "ies"} match
            </p>
          )}
          <div className="grid">
            {results.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
