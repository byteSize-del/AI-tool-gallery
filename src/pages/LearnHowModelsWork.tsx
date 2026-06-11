import { Link } from "react-router-dom";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";

export default function LearnHowModelsWork() {
  const ready = usePageReady();
  if (!ready) return <SkeletonGrid count={4} variant="tool" />;

  return (
    <div className="fade-up">
      <Link to="/learn" className="back-link">
        Back to Learn
      </Link>

      <header className="section-head">
        <h1>How models work ⚙️</h1>
        <p>Tokens, context windows, and why length matters.</p>
      </header>

      <article className="sketch-box prose">
        <h2>Everything becomes tokens</h2>
        <p>
          A language model doesn&apos;t read words the way you do. It first
          breaks your text into <strong>tokens</strong>, small chunks that are
          often a word or part of a word. &ldquo;Sketchbook&rdquo; might be two
          tokens (&ldquo;sketch&rdquo; + &ldquo;book&rdquo;). As a rough guide,
          one token is about four characters, or 100 tokens ≈ 75 words.
        </p>

        <h2>It predicts one token at a time</h2>
        <p>
          The model looks at all the tokens so far and predicts the most likely
          next one, adds it, then repeats. That&apos;s why answers stream in
          piece by piece, and why the same prompt can give slightly different
          answers: there&apos;s a bit of controlled randomness in the choice.
        </p>

        <h2>The context window is its short-term memory</h2>
        <p>
          The <strong>context window</strong> is how many tokens the model can
          &ldquo;see&rdquo; at once, your prompt plus its reply plus the earlier
          conversation. When a chat gets very long, the oldest parts fall out of
          the window and the model effectively &ldquo;forgets&rdquo; them.
        </p>
        <ul className="check-list">
          <li>Longer inputs cost more and can run slower.</li>
          <li>If the model forgets earlier details, re-paste the key parts.</li>
          <li>Summarise long documents instead of dumping everything in.</li>
        </ul>

        <h2>Temperature: creative vs. predictable</h2>
        <p>
          Many tools expose a <strong>temperature</strong> setting. Low values
          make answers focused and repeatable (good for code or facts); higher
          values make them more varied and creative (good for brainstorming).
        </p>

        <div className="callout">
          💡 Mental model: the model is autocomplete on steroids, with a limited
          window of memory. Keep what matters inside that window.
        </div>

        <div style={{ marginTop: "1.4rem" }}>
          <Link to="/learn/prompting" className="sketch-btn">
            Next: What is prompting? →
          </Link>
        </div>
      </article>
    </div>
  );
}
