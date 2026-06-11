import { Link } from "react-router-dom";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";

export default function LearnAITools() {
  const ready = usePageReady(650);
  if (!ready) return <SkeletonGrid count={4} variant="tool" />;

  return (
    <div className="fade-up">
      <Link to="/learn" className="back-link">
        Back to Learn
      </Link>

      <header className="section-head">
        <h1>What are AI tools? 🧠</h1>
        <p>And how do they actually work?</p>
      </header>

      <article className="sketch-box prose">
        <h2>The short version</h2>
        <p>
          An AI tool is software that uses a <strong>machine-learning
          model</strong> to do something that used to need a human, like writing
          text, drawing a picture, transcribing audio or answering a question.
          Instead of following hand-written rules, the model learned patterns
          from huge amounts of examples.
        </p>

        <h2>How the models learn</h2>
        <p>
          Most modern AI tools are built on models trained on enormous datasets,
          billions of words, images, or hours of audio. During training the
          model adjusts millions (or billions) of internal numbers called{" "}
          <em>parameters</em> until it gets good at predicting what comes next:
          the next word in a sentence, the next pixel in an image, and so on.
        </p>

        <h2>The two big families</h2>
        <ul className="check-list">
          <li>
            <strong>Large Language Models (LLMs)</strong> power chatbots,
            writing and coding tools. They predict text one piece at a time.
          </li>
          <li>
            <strong>Diffusion models</strong> power most image, video and audio
            generators. They start from noise and refine it into a result.
          </li>
        </ul>

        <h2>What this means for you</h2>
        <p>
          You don&apos;t need to understand the maths. What matters is that AI
          tools are <strong>prediction engines</strong>: you give them an input
          (your prompt), and they produce the most likely useful output. They
          are powerful but not perfect, so they can be confidently wrong. Always
          review what they make before you rely on it.
        </p>

        <div className="callout">
          💡 Rule of thumb: an AI tool is a very fast, very well-read assistant
          that needs clear instructions and a human to check its work.
        </div>

        <div style={{ marginTop: "1.4rem" }}>
          <Link to="/learn/how-models-work" className="sketch-btn">
            Next: How models work →
          </Link>
        </div>
      </article>
    </div>
  );
}
