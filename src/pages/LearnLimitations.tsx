import { Link } from "react-router-dom";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";

export default function LearnLimitations() {
  const ready = usePageReady();
  if (!ready) return <SkeletonGrid count={4} variant="tool" />;

  return (
    <div className="fade-up">
      <Link to="/learn" className="back-link">
        Back to Learn
      </Link>

      <header className="section-head">
        <h1>Limitations &amp; verification 🧐</h1>
        <p>Why AI can be confidently wrong, and how to check it.</p>
      </header>

      <article className="sketch-box prose">
        <h2>Hallucinations</h2>
        <p>
          A <strong>hallucination</strong> is when a model states something
          false as if it were true, a fake citation, a wrong date, an invented
          API. It happens because the model predicts plausible-sounding text; it
          doesn&apos;t &ldquo;know&rdquo; facts the way a database does. Fluent
          does not mean correct.
        </p>

        <h2>Other common limits</h2>
        <ul className="check-list">
          <li>
            <strong>Knowledge cutoff</strong>: a model may not know recent
            events unless it can search the web.
          </li>
          <li>
            <strong>Maths &amp; counting</strong>: it can slip on exact
            calculations, use a calculator or code for precision.
          </li>
          <li>
            <strong>Bias</strong>: it reflects patterns in its training data,
            including stereotypes.
          </li>
          <li>
            <strong>Overconfidence</strong>: it rarely says &ldquo;I don&apos;t
            know&rdquo; unless asked to.
          </li>
        </ul>

        <h2>How to verify</h2>
        <ol className="step-list">
          <li>Treat output as a draft, not a final answer.</li>
          <li>Cross-check facts, numbers and quotes against a trusted source.</li>
          <li>Click through any citations, do they actually exist and say that?</li>
          <li>Ask the model to explain its reasoning so you can spot gaps.</li>
          <li>For anything important (health, legal, money), confirm with an expert.</li>
        </ol>

        <div className="callout">
          ⚠️ Golden rule: the AI is responsible for the draft; you are
          responsible for the truth. Never publish or submit unchecked output.
        </div>

        <div style={{ marginTop: "1.4rem" }}>
          <Link to="/learn/ethics-privacy" className="sketch-btn">
            Next: Ethics, privacy &amp; copyright →
          </Link>
        </div>
      </article>
    </div>
  );
}
