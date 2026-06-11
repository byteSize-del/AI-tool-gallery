import { Link } from "react-router-dom";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";

export default function LearnEthicsPrivacy() {
  const ready = usePageReady();
  if (!ready) return <SkeletonGrid count={4} variant="tool" />;

  return (
    <div className="fade-up">
      <Link to="/learn" className="back-link">
        Back to Learn
      </Link>

      <header className="section-head">
        <h1>Ethics, privacy &amp; copyright ⚖️</h1>
        <p>Using AI responsibly, and safely.</p>
      </header>

      <article className="sketch-box prose">
        <h2>Privacy: mind what you paste</h2>
        <p>
          Anything you type into a tool may be sent to that company&apos;s
          servers and, on some free plans, used to improve their models. Don&apos;t
          paste passwords, personal data about others, or confidential
          work/school information.
        </p>
        <ul className="check-list">
          <li>Strip names and personal details before sharing examples.</li>
          <li>Check the tool&apos;s data and training settings.</li>
          <li>Prefer reputable tools for anything sensitive.</li>
        </ul>

        <h2>Bias &amp; fairness</h2>
        <p>
          Models learn from human data, so they can repeat stereotypes or
          under-represent groups. Be especially careful when AI output affects
          people, hiring, grading, or who gets seen.
        </p>

        <h2>Copyright &amp; ownership</h2>
        <ul className="check-list">
          <li>
            Ownership of AI-generated work is legally unsettled and varies by
            country.
          </li>
          <li>
            Training-data and style-imitation debates are ongoing, credit human
            creators where relevant.
          </li>
          <li>
            For commercial work, prefer tools that offer commercially-safe or
            licensed output (e.g. enterprise image generators).
          </li>
        </ul>

        <h2>Honesty &amp; academic integrity</h2>
        <p>
          Disclose AI use when it matters, and follow your school or
          workplace&apos;s rules. AI &ldquo;detectors&rdquo; are unreliable and
          produce false positives, so don&apos;t treat them as proof. Use AI to
          learn and draft, not to misrepresent someone else&apos;s work as your
          own.
        </p>

        <div className="callout">
          💡 Quick test before you paste or publish: &ldquo;Would I be
          comfortable if this input, or this output, were made public with my
          name on it?&rdquo;
        </div>

        <div style={{ marginTop: "1.4rem" }}>
          <Link to="/learn/choosing-tools" className="sketch-btn">
            Next: Choosing the right tool →
          </Link>
        </div>
      </article>
    </div>
  );
}
