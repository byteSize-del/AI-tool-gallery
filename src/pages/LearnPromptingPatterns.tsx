import { Link } from "react-router-dom";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";

export default function LearnPromptingPatterns() {
  const ready = usePageReady();
  if (!ready) return <SkeletonGrid count={4} variant="tool" />;

  return (
    <div className="fade-up">
      <Link to="/learn" className="back-link">
        Back to Learn
      </Link>

      <header className="section-head">
        <h1>Prompting patterns ✨</h1>
        <p>Techniques that go beyond the basic recipe.</p>
      </header>

      <article className="sketch-box prose">
        <h2>Few-shot: show examples</h2>
        <p>
          Instead of describing what you want, <strong>show</strong> a couple of
          examples and let the model copy the pattern. Great for consistent
          formatting.
        </p>
        <div className="callout">
          Turn &ldquo;cat → kitten&rdquo;, &ldquo;dog → puppy&rdquo;, then ask
          &ldquo;cow → ?&rdquo;. The model continues the pattern.
        </div>

        <h2>Chain-of-thought: ask it to reason</h2>
        <p>
          For tricky problems, add <em>&ldquo;think step by step&rdquo;</em>.
          The model works through the logic before answering, which improves
          accuracy on maths, logic and multi-step tasks.
        </p>

        <h2>Roles: system vs. user</h2>
        <p>
          Many tools separate a <strong>system</strong> instruction (the
          standing rules: &ldquo;You are a concise tutor&rdquo;) from your{" "}
          <strong>user</strong> messages (the actual questions). Set the
          behaviour once in the system role, then just ask.
        </p>

        <h2>Iterate and refine</h2>
        <ul className="check-list">
          <li>Ask for several options, then build on the best one.</li>
          <li>Give feedback: &ldquo;shorter&rdquo;, &ldquo;more formal&rdquo;.</li>
          <li>Ask the model to critique its own answer, then improve it.</li>
          <li>Save prompts that work well so you can reuse them.</li>
        </ul>

        <h2>Guardrails that improve answers</h2>
        <ul className="check-list">
          <li>&ldquo;If you&apos;re unsure, say so&rdquo; reduces made-up facts.</li>
          <li>&ldquo;Cite your sources&rdquo; makes claims checkable.</li>
          <li>&ldquo;Ask me questions first&rdquo; gathers missing context.</li>
        </ul>

        <div className="callout">
          💡 The best prompters treat it like a conversation, not a vending
          machine. Steer, don&apos;t just submit.
        </div>

        <div style={{ marginTop: "1.4rem" }}>
          <Link to="/learn/limitations" className="sketch-btn">
            Next: Limitations &amp; verification →
          </Link>
        </div>
      </article>
    </div>
  );
}
