import { Link } from "react-router-dom";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";

export default function LearnStayingCurrent() {
  const ready = usePageReady();
  if (!ready) return <SkeletonGrid count={4} variant="tool" />;

  return (
    <div className="fade-up">
      <Link to="/learn" className="back-link">
        Back to Learn
      </Link>

      <header className="section-head">
        <h1>Staying current 🌱</h1>
        <p>AI moves fast, learn to evaluate, not just memorise.</p>
      </header>

      <article className="sketch-box prose">
        <h2>Why this matters</h2>
        <p>
          Today&apos;s &ldquo;best&rdquo; tool may be overtaken in a few months.
          The rankings in this sketchbook are a dated snapshot, useful, but a
          starting point. The durable skill is being able to judge a new tool
          yourself.
        </p>

        <h2>How to evaluate any new tool</h2>
        <ol className="step-list">
          <li>Who makes it, and is it actively maintained?</li>
          <li>What does it actually do well, versus the hype?</li>
          <li>What does it cost, and what are the free-tier limits?</li>
          <li>How does it handle your data and privacy?</li>
          <li>Run a small real task and compare it to your current tool.</li>
        </ol>

        <h2>Ways to keep up without drowning</h2>
        <ul className="check-list">
          <li>Follow a couple of trusted newsletters or creators, not everything.</li>
          <li>Try one new tool a month on a real task, rather than collecting bookmarks.</li>
          <li>Re-check leaderboards and comparisons before big decisions.</li>
          <li>Trust your own test over marketing claims.</li>
        </ul>

        <div className="callout">
          💡 The goal isn&apos;t to know every tool, it&apos;s to confidently
          pick a good one for the job in front of you.
        </div>

        <div style={{ marginTop: "1.4rem", display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          <Link to="/home" className="sketch-btn">
            Explore the tools →
          </Link>
          <Link to="/learn" className="sketch-btn sketch-btn--ghost">
            Back to the Learn hub
          </Link>
        </div>
      </article>
    </div>
  );
}
