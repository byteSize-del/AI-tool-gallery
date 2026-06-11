import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";
import StatTile from "../components/StatTile";
import type { Pricing } from "../types";

const pricingClass: Record<Pricing, string> = {
  Free: "tag-free",
  Freemium: "tag-freemium",
  Paid: "tag-paid",
  "Open Source": "tag-open",
};

export default function About() {
  const ready = usePageReady(650);
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const totalTools = categories.reduce((s, c) => s + c.tools.length, 0);
    const pricing: Record<Pricing, number> = {
      Free: 0,
      Freemium: 0,
      Paid: 0,
      "Open Source": 0,
    };
    for (const c of categories) {
      for (const t of c.tools) pricing[t.pricing]++;
    }
    return { totalTools, pricing };
  }, []);

  if (!ready) {
    return <SkeletonGrid count={4} variant="tool" />;
  }

  const pricingEntries = Object.entries(stats.pricing) as [Pricing, number][];

  return (
    <div className="fade-up">
      <header className="section-head">
        <h1>About this Sketchbook 📓</h1>
        <p>A doodled directory of the AI landscape.</p>
      </header>

      <div className="home-stats" style={{ marginBottom: "1.8rem" }}>
        <StatTile value={categories.length} label="categories" delay={0} />
        <StatTile value={stats.totalTools} label="AI tools" suffix="+" delay={100} />
        <StatTile value={4} label="pricing tiers" delay={200} />
        <StatTile value={250} label="hand-drawn vibes" suffix="%" delay={300} />
      </div>

      <div className="sketch-box prose" style={{ marginBottom: "1.6rem" }}>
        <p>
          This little website collects <strong>{stats.totalTools}+</strong> AI
          tools across <strong>{categories.length}</strong> categories, from
          image generation and coding to music, research and 3D modeling. The
          goal is simple: when you wonder{" "}
          <em>&ldquo;which tool should I use for this?&rdquo;</em> you can flip
          open this sketchbook and find a tidy shelf of options.
        </p>
        <p>
          The whole interface is drawn to feel like a hand-sketched notebook,
          wobbly borders, marker fonts and all. Every page shows a quick loading
          screen and skeleton placeholders while the shelves get arranged.
        </p>
      </div>

      {/* Pricing breakdown */}
      <section className="sketch-box info-section">
        <h2 className="info-section__title">
          <span className="info-section__icon">🏷️</span> Tools by pricing
        </h2>
        <div className="pricing-grid">
          {pricingEntries.map(([tier, count]) => (
            <div key={tier} className="pricing-stat">
              <span className={`sketch-tag ${pricingClass[tier]}`}>{tier}</span>
              <span className="pricing-stat__count">{count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category breakdown */}
      <section className="sketch-box info-section">
        <h2 className="info-section__title">
          <span className="info-section__icon">🗂️</span> Every shelf at a glance
        </h2>
        <div className="cat-chip-grid">
          {categories.map((c) => (
            <button
              key={c.id}
              className="cat-chip"
              onClick={() => navigate(`/category/${c.id}`)}
            >
              <span className="cat-chip__icon">{c.icon}</span>
              <span className="cat-chip__name">{c.name}</span>
              <span className="cat-chip__count">{c.tools.length}</span>
            </button>
          ))}
        </div>
      </section>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link to="/home" className="sketch-btn">
          Start browsing →
        </Link>
      </div>
    </div>
  );
}
