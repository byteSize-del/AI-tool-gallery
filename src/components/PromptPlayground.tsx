import { useMemo, useState } from "react";

/**
 * An offline, deterministic prompt "playground". Students toggle the
 * pieces of the prompting recipe on a fixed task and watch the assembled
 * prompt, a quality meter, and a representative answer improve in real
 * time, no API key, no network, nothing to fail during a live talk.
 */

interface Ingredient {
  id: string;
  label: string;
  fragment: string;
  cls: string;
}

const BASE_TASK = "Explain why daily walks matter for dogs.";

const ingredients: Ingredient[] = [
  {
    id: "role",
    label: "Role",
    fragment: "Act as a friendly veterinarian.",
    cls: "pp-role",
  },
  {
    id: "context",
    label: "Context",
    fragment: "The reader just adopted their first puppy.",
    cls: "pp-context",
  },
  {
    id: "format",
    label: "Format",
    fragment: "Keep it under 120 words and end with 3 quick bullet tips.",
    cls: "pp-format",
  },
  {
    id: "tone",
    label: "Tone",
    fragment: "Use a warm, encouraging tone.",
    cls: "pp-task",
  },
];

// representative answers that get sharper as more recipe parts are added
const outputs = [
  {
    min: 0,
    note: "Vague prompt → generic, unfocused answer.",
    text: "Dogs need walks. Walking is good exercise and helps dogs stay healthy. Most dogs enjoy going outside and it is a common part of owning a dog.",
  },
  {
    min: 2,
    note: "Getting there → more relevant, but still a bit flat.",
    text: "Daily walks keep dogs physically healthy and mentally stimulated. They burn energy, support a healthy weight, and give dogs a chance to explore new smells, which keeps them calm and content at home.",
  },
  {
    min: 3,
    note: "Strong prompt → focused, on-audience, correctly formatted.",
    text: "Congratulations on your new puppy! Daily walks are one of the best things you can do for them. They burn off energy, support a healthy weight, and let that curious nose explore, which keeps your pup calm and happy at home. It's also bonding time that builds trust.\n\n• Start with two short 10–15 minute walks a day.\n• Bring water and a few treats for training.\n• Let them sniff, it's how dogs read the world.",
  },
];

export default function PromptPlayground() {
  const [enabled, setEnabled] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setEnabled((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const score = enabled.size;
  const pct = Math.round((score / ingredients.length) * 100);

  const output = useMemo(() => {
    return [...outputs].reverse().find((o) => score >= o.min) ?? outputs[0];
  }, [score]);

  const strength =
    score === 0 ? "Too vague" : score < 3 ? "Improving" : "Strong prompt";

  return (
    <div className="playground">
      <p className="playground__intro">
        Toggle the recipe pieces and watch the prompt, and the answer, get
        better. The task stays the same; only how you ask changes.
      </p>

      {/* toggles */}
      <div className="playground__toggles">
        {ingredients.map((ing) => {
          const on = enabled.has(ing.id);
          return (
            <button
              key={ing.id}
              className={`playground__toggle ${ing.cls} ${on ? "on" : ""}`}
              aria-pressed={on}
              onClick={() => toggle(ing.id)}
            >
              <span className="playground__toggle-box">{on ? "✓" : "+"}</span>
              {ing.label}
            </button>
          );
        })}
      </div>

      {/* assembled prompt */}
      <div className="playground__prompt">
        <span className="playground__field-label">Your prompt</span>
        <p className="playground__prompt-text">
          <span className="pp pp-task">{BASE_TASK}</span>{" "}
          {ingredients
            .filter((ing) => enabled.has(ing.id))
            .map((ing) => (
              <span key={ing.id} className={`pp ${ing.cls}`}>
                {ing.fragment}{" "}
              </span>
            ))}
        </p>
      </div>

      {/* quality meter */}
      <div className="playground__meter">
        <div className="playground__meter-track">
          <div
            className={`playground__meter-fill meter-${
              score === 0 ? "low" : score < 3 ? "mid" : "high"
            }`}
            style={{ width: `${Math.max(pct, 8)}%` }}
          />
        </div>
        <span className="playground__meter-label">{strength}</span>
      </div>

      {/* output */}
      <div className="playground__output">
        <span className="playground__field-label">🤖 What you get back</span>
        <p className="playground__output-note">{output.note}</p>
        {output.text.split("\n\n").map((para, i) => (
          <p key={i} className="playground__output-text">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
