import { Link, useNavigate } from "react-router-dom";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";

const topics = [
  {
    to: "/learn/ai-tools",
    icon: "🧠",
    step: "01",
    title: "What are AI tools?",
    text: "What AI tools are and how the models behind them work.",
    accent: "var(--accent-2)",
  },
  {
    to: "/learn/how-models-work",
    icon: "⚙️",
    step: "02",
    title: "How models work",
    text: "Tokens, context windows, and why prompt length matters.",
    accent: "var(--accent-4)",
  },
  {
    to: "/learn/prompting",
    icon: "💬",
    step: "03",
    title: "What is prompting?",
    text: "How to talk to AI so it gives you what you want, with a live playground.",
    accent: "var(--accent)",
  },
  {
    to: "/learn/prompting-patterns",
    icon: "✨",
    step: "04",
    title: "Prompting patterns",
    text: "Few-shot, chain-of-thought, roles, and iterating like a pro.",
    accent: "var(--accent-3)",
  },
  {
    to: "/learn/limitations",
    icon: "🧐",
    step: "05",
    title: "Limitations & verification",
    text: "Why AI can be confidently wrong, and how to check its work.",
    accent: "var(--accent-2)",
  },
  {
    to: "/learn/ethics-privacy",
    icon: "⚖️",
    step: "06",
    title: "Ethics, privacy & copyright",
    text: "Using AI responsibly: data safety, bias, ownership and honesty.",
    accent: "var(--accent)",
  },
  {
    to: "/learn/choosing-tools",
    icon: "🧭",
    step: "07",
    title: "Choosing the right tool",
    text: "A simple framework for picking the best fit for any task.",
    accent: "var(--accent-4)",
  },
  {
    to: "/learn/staying-current",
    icon: "🌱",
    step: "08",
    title: "Staying current",
    text: "How to evaluate brand-new tools yourself as the field moves.",
    accent: "var(--accent-3)",
  },
];

export default function Learn() {
  const ready = usePageReady(650);
  const navigate = useNavigate();

  return (
    <div>
      <header className="section-head fade-up">
        <h1>Learn the Basics 📚</h1>
        <p>New to AI? Follow this 8-step track in order, or jump to any topic.</p>
      </header>

      {ready ? (
        <div className="learn-track">
          {topics.map((t, i) => (
            <div
              key={t.to}
              className="sketch-box learn-card pop-in"
              style={{ animationDelay: `${i * 70}ms` }}
              role="button"
              tabIndex={0}
              onClick={() => navigate(t.to)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(t.to);
                }
              }}
            >
              <span
                className="learn-card__step"
                style={{ background: t.accent }}
              >
                {t.step}
              </span>
              <span className="learn-card__icon">{t.icon}</span>
              <h2 className="learn-card__title">{t.title}</h2>
              <p className="learn-card__text">{t.text}</p>
              <span className="learn-card__cta">Read this →</span>
            </div>
          ))}
        </div>
      ) : (
        <SkeletonGrid count={8} variant="category" />
      )}

      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <Link to="/home" className="sketch-btn">
          Skip to the tools →
        </Link>
      </div>
    </div>
  );
}
