import { Link } from "react-router-dom";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";
import PromptPlayground from "../components/PromptPlayground";

export default function LearnPrompting() {
  const ready = usePageReady(650);
  if (!ready) return <SkeletonGrid count={4} variant="tool" />;

  return (
    <div className="fade-up">
      <Link to="/learn" className="back-link">
        Back to Learn
      </Link>

      <header className="section-head">
        <h1>What is prompting? 💬</h1>
        <p>How to talk to AI so it gives you what you want.</p>
      </header>

      <article className="sketch-box prose">
        <h2>Prompting in one line</h2>
        <p>
          A <strong>prompt</strong> is the instruction you give an AI tool. It
          can be a question, a description, a chunk of text to transform, or an
          image to start from. Prompting is simply the skill of asking well.
        </p>

        <h2>Why it matters</h2>
        <p>
          The model can only work with what you give it. A vague prompt gets a
          vague result; a clear, specific prompt gets a focused one. Small
          changes in wording can change the output a lot, which is why
          &ldquo;prompt engineering&rdquo; became a thing.
        </p>

        <h2>A simple recipe that works everywhere</h2>
        <ol className="step-list">
          <li>
            <strong>Role</strong> — who should the AI act as? &ldquo;Act as a
            UX writer.&rdquo;
          </li>
          <li>
            <strong>Task</strong> — what exactly do you want? &ldquo;Write 3
            button labels.&rdquo;
          </li>
          <li>
            <strong>Context</strong> — the background and any source material.
          </li>
          <li>
            <strong>Format</strong> — how the answer should look (a list, a
            table, 50 words).
          </li>
          <li>
            <strong>Refine</strong> — react to the result: &ldquo;shorter&rdquo;,
            &ldquo;more playful&rdquo;, &ldquo;try again&rdquo;.
          </li>
        </ol>

        <h2>See it in action ✏️</h2>
        <p>
          Same goal, two prompts. Watch how adding the recipe turns a vague ask
          into a focused one.
        </p>

        <div className="prompt-example">
          <div className="prompt-card prompt-card--weak">
            <span className="prompt-card__label">🥱 Weak prompt</span>
            <p className="prompt-card__text">&ldquo;Write about dogs.&rdquo;</p>
            <p className="prompt-card__note">
              Too open-ended. The AI has to guess the audience, length, tone and
              point, so you get something generic.
            </p>
          </div>

          <div className="prompt-card prompt-card--strong">
            <span className="prompt-card__label">💪 Strong prompt</span>
            <p className="prompt-card__text">
              &ldquo;<span className="pp pp-role">Act as a vet writing for new
              pet owners.</span>{" "}
              <span className="pp pp-task">Explain why daily walks matter for
              dogs.</span>{" "}
              <span className="pp pp-context">Assume the reader just adopted
              their first puppy.</span>{" "}
              <span className="pp pp-format">Keep it under 120 words, friendly
              tone, and end with 3 quick bullet tips.</span>&rdquo;
            </p>
            <div className="prompt-card__legend">
              <span className="pp pp-role">Role</span>
              <span className="pp pp-task">Task</span>
              <span className="pp pp-context">Context</span>
              <span className="pp pp-format">Format</span>
            </div>
          </div>
        </div>

        <div className="prompt-result">
          <span className="prompt-result__label">🤖 What you get back</span>
          <p>
            Congratulations on your new puppy! Daily walks are one of the best
            things you can do for them. Walking burns off energy (so your shoes
            survive), keeps their weight healthy, and gives their curious nose a
            world of new smells to explore. It&apos;s also bonding time that
            helps your pup feel safe and learn how to behave around people and
            other dogs.
          </p>
          <ul className="check-list">
            <li>Start with 10–15 minute walks, twice a day.</li>
            <li>Bring water and a few treats for training.</li>
            <li>Let them sniff, it&apos;s how dogs &ldquo;read the news&rdquo;.</li>
          </ul>
        </div>

        <div className="callout">
          🔁 Next step: try following up with &ldquo;make it funnier&rdquo; or
          &ldquo;rewrite it for kids&rdquo;, that&apos;s the <em>Refine</em> step
          in action.
        </div>

        <h2>Try it yourself 🎮</h2>
        <p>
          This mini playground runs entirely in your browser, no account
          needed. Flip the recipe pieces on and off to feel how each one
          sharpens the result.
        </p>
        <PromptPlayground />

        <h2>Prompting changes by tool</h2>
        <ul className="check-list">
          <li>
            <strong>Chat &amp; writing</strong>: full sentences, give context and
            ask follow-ups.
          </li>
          <li>
            <strong>Image &amp; video</strong>: describe the visual, style,
            lighting and camera; use negative prompts.
          </li>
          <li>
            <strong>Coding</strong>: state the language, framework and expected
            behaviour; share code and errors.
          </li>
          <li>
            <strong>Music &amp; voice</strong>: name genre, mood, tempo, or paste
            lyrics / scripts.
          </li>
        </ul>

        <div className="callout">
          💡 The fastest way to improve: write a prompt, look at the result, then
          tell the AI exactly what to change. Iterating beats over-thinking the
          first prompt.
        </div>

        <p>
          Every tool page in this sketchbook has a{" "}
          <em>&ldquo;How prompting works here&rdquo;</em> section with tips
          tailored to that specific tool.
        </p>

        <div style={{ marginTop: "1.4rem" }}>
          <Link to="/learn/prompting-patterns" className="sketch-btn">
            Next: Prompting patterns →
          </Link>
        </div>
      </article>
    </div>
  );
}
