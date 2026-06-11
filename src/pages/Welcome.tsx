import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import StatTile from "../components/StatTile";

const rotatingWords = ["create", "code", "write", "design", "imagine", "build"];

const floatingDoodles = [
  { emoji: "🎨", className: "doodle-1" },
  { emoji: "💻", className: "doodle-2" },
  { emoji: "🎬", className: "doodle-3" },
  { emoji: "🎵", className: "doodle-4" },
  { emoji: "✏️", className: "doodle-5" },
  { emoji: "🤖", className: "doodle-6" },
  { emoji: "✨", className: "doodle-7" },
  { emoji: "📓", className: "doodle-8" },
];

export default function Welcome() {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);

  const totalTools = categories.reduce((sum, c) => sum + c.tools.length, 0);

  // cycle the highlighted verb every couple of seconds
  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="welcome">
      {/* floating background doodles */}
      <div className="welcome__doodles" aria-hidden="true">
        {floatingDoodles.map((d) => (
          <span key={d.className} className={`floating-doodle ${d.className}`}>
            {d.emoji}
          </span>
        ))}
      </div>

      <div className="sketch-box welcome__card fade-up">
        <h1 className="welcome__title">
          Welcome to this website <span className="wave">👋</span>
        </h1>
        <p className="welcome__subtitle">
          A hand-drawn sketchbook of the best AI tools to help you{" "}
          <span key={wordIndex} className="rotating-word">
            {rotatingWords[wordIndex]}
          </span>
          , sorted into tidy little categories so you always know which tool to
          reach for.
        </p>

        <div className="welcome__stats">
          <StatTile value={categories.length} label="categories" delay={0} />
          <StatTile value={totalTools} label="AI tools" suffix="+" delay={120} />
          <StatTile value={1} label="sketchbook" delay={240} />
        </div>

        <div className="welcome__cta-row">
          <button className="sketch-btn" onClick={() => navigate("/home")}>
            Open the Sketchbook →
          </button>
          <button
            className="sketch-btn sketch-btn--ghost"
            onClick={() => navigate("/learn")}
          >
            Start with the basics
          </button>
        </div>

        <div className="welcome__chips">
          <span className="welcome__chips-label">Jump to:</span>
          {categories.slice(0, 6).map((c) => (
            <button
              key={c.id}
              className="chip"
              onClick={() => navigate(`/category/${c.id}`)}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="welcome__hint">
        Made with <span className="heart">♥</span> by{" "}
        <span className="hyper">Hypercode</span>
      </p>
    </div>
  );
}
