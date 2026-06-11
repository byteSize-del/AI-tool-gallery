import { Link } from "react-router-dom";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";

export default function LearnChoosingTools() {
  const ready = usePageReady();
  if (!ready) return <SkeletonGrid count={4} variant="tool" />;

  return (
    <div className="fade-up">
      <Link to="/learn" className="back-link">
        Back to Learn
      </Link>

      <header className="section-head">
        <h1>Choosing the right tool 🧭</h1>
        <p>There&apos;s rarely one &ldquo;best&rdquo;, only the best fit.</p>
      </header>

      <article className="sketch-box prose">
        <h2>Start with the task, not the tool</h2>
        <p>
          Name the job first (&ldquo;write a product description&rdquo;,
          &ldquo;generate a logo&rdquo;, &ldquo;fix this code&rdquo;), then pick
          the category. This sketchbook sorts tools into 12 categories for
          exactly this reason.
        </p>

        <h2>Five questions to compare options</h2>
        <ul className="check-list">
          <li>
            <strong>Quality</strong> — is the output good enough for the job?
          </li>
          <li>
            <strong>Cost</strong> — Free, Freemium, Paid, or Open Source? What&apos;s
            the real monthly cost?
          </li>
          <li>
            <strong>Privacy</strong> — is your data safe with this provider?
          </li>
          <li>
            <strong>Speed &amp; limits</strong> — fast enough? Any usage caps?
          </li>
          <li>
            <strong>Fit</strong> — does it plug into the tools you already use?
          </li>
        </ul>

        <h2>Use the built-in helpers</h2>
        <p>
          On each category page you can filter by <strong>Top picks</strong>,{" "}
          <strong>Strong</strong>, <strong>Free</strong>, or{" "}
          <strong>Open Source</strong>, and every tool is tagged by quality
          tier and pricing. To weigh two or three options against each other,
          use the Compare view.
        </p>

        <div className="callout">
          💡 Most pros use a small stack, one tool for daily work and another for
          tougher jobs, rather than hunting for a single &ldquo;best&rdquo; tool.
        </div>

        <div style={{ marginTop: "1.4rem", display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          <Link to="/compare" className="sketch-btn">
            Open the Compare view →
          </Link>
          <Link to="/learn/staying-current" className="sketch-btn sketch-btn--ghost">
            Next: Staying current →
          </Link>
        </div>
      </article>
    </div>
  );
}
