import { Link, useNavigate } from "react-router-dom";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";

const topics = [
  {
    to: "/learn/ai-tools",
    icon: "🧠",
    step: "01",
    title: "What are AI tools?",
    text: "Understand what AI tools actually are and how they work under the hood.",
    accent: "var(--accent-2)",
  },
  {
    to: "/learn/prompting",
    icon: "💬",
    step: "02",
    title: "What is prompting?",
    text: "Learn how prompting works and how to talk to AI so it gives you what you want.",
    accent: "var(--accent)",
  },
  {
    to: "/home",
    icon: "🗂️",
    step: "03",
    title: "How categories work",
    text: "See how we sort 250+ tools into 12 shelves so you find the right one fast.",
    accent: "var(--accent-4)",
  },
];

export default function Learn() {
  const ready = usePageReady(650);
  const navigate = useNavigate();

  return (
    <div>
      <header className="section-head fade-up">
        <h1>Learn the Basics 📚</h1>
        <p>New to AI tools? Follow these three short reads, then dive in.</p>
      </header>

      {ready ? (
        <div className="learn-track">
          {topics.map((t, i) => (
            <div
              key={t.to}
              className="sketch-box learn-card pop-in"
              style={{ animationDelay: `${i * 90}ms` }}
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
        <SkeletonGrid count={3} variant="category" />
      )}

      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <Link to="/home" className="sketch-btn">
          Skip to the tools →
        </Link>
      </div>
    </div>
  );
}
