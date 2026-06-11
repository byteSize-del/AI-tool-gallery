import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { categories } from "../data/categories";
import { slugify } from "../utils/slug";
import { resolveTier } from "../data/tiers";
import { resolveToolDetail } from "../utils/toolDetail";
import ToolLogo from "../components/ToolLogo";
import TierBadge from "../components/TierBadge";
import { usePageReady } from "../hooks/usePageReady";

function ToolSkeleton() {
  return (
    <div className="fade-up">
      <div className="sketch-box tool-hero" aria-hidden="true">
        <div className="skeleton skel-icon" style={{ width: 96, height: 96 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton skel-line lg" />
          <div className="skeleton skel-line" />
          <div className="skeleton skel-line sm" />
        </div>
      </div>
      <div className="sketch-box" style={{ padding: "1.4rem", marginTop: "1.4rem" }}>
        <div className="skeleton skel-line lg" />
        <div className="skeleton skel-line" />
        <div className="skeleton skel-line" />
        <div className="skeleton skel-line sm" />
      </div>
    </div>
  );
}

export default function ToolPage() {
  const { id, toolSlug } = useParams<{ id: string; toolSlug: string }>();
  const category = categories.find((c) => c.id === id);
  const tool = category?.tools.find((t) => slugify(t.name) === toolSlug);

  const ready = usePageReady(700, [id, toolSlug]);

  if (!category || !tool) {
    return (
      <div className="section-head fade-up">
        <h1>Couldn&apos;t find that tool 🔍</h1>
        <p>It may have been renamed or moved.</p>
        <Link to="/home" className="back-link">
          Back to categories
        </Link>
      </div>
    );
  }

  if (!ready) {
    return <ToolSkeleton />;
  }

  const detail = resolveToolDetail(tool, category.id);

  return (
    <div className="fade-up">
      <Link to={`/category/${category.id}`} className="back-link">
        Back to {category.name}
      </Link>

      {/* Hero */}
      <header className="sketch-box tool-hero">
        <ToolLogo name={tool.name} size={104} />
        <div className="tool-hero__body">
          <div className="tool-hero__top">
            <h1 className="tool-hero__name">{tool.name}</h1>
            <TierBadge tier={resolveTier(tool)} />
            <span className={`sketch-tag tag-${pricingKey(tool.pricing)}`}>
              {tool.pricing}
            </span>
          </div>
          <p className="tool-hero__desc">{tool.description}</p>
          <div className="tool-hero__meta">
            <span className="sketch-tag tag-freemium">{category.icon} {category.name}</span>
            <a
              className="sketch-btn sketch-btn--ghost tool-hero__cta"
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open {tool.name} ↗
            </a>
          </div>
        </div>
      </header>

      {/* Who made it */}
      <Section icon="🏷️" title="Who made it">
        <p>
          <strong>{tool.name}</strong> is made by <strong>{detail.maker}</strong>.
        </p>
        <p className="muted">First launched: {detail.founded}.</p>
      </Section>

      {/* How it works */}
      <Section icon="⚙️" title="How it works">
        <p>{detail.howItWorks}</p>
      </Section>

      {/* How prompting works on this tool */}
      <Section icon="💬" title="How prompting works here">
        <p>{detail.promptStyle}</p>
      </Section>

      {/* How to prompt */}
      <Section icon="✨" title="How to prompt it well">
        <ul className="check-list">
          {detail.promptTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </Section>

      {/* How to use */}
      <Section icon="🧭" title="How to use it">
        <ol className="step-list">
          {detail.howToUse.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Section>

      {/* How to log in */}
      <Section icon="🔑" title="How to sign up & log in">
        <ol className="step-list">
          {detail.loginSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Section>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <a
          className="sketch-btn"
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Try {tool.name} now ↗
        </a>
      </div>
    </div>
  );
}

function pricingKey(pricing: string): string {
  switch (pricing) {
    case "Free":
      return "free";
    case "Paid":
      return "paid";
    case "Open Source":
      return "open";
    default:
      return "freemium";
  }
}

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="sketch-box info-section">
      <h2 className="info-section__title">
        <span className="info-section__icon">{icon}</span>
        {title}
      </h2>
      <div className="info-section__body">{children}</div>
    </section>
  );
}
