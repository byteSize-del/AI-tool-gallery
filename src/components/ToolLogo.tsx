interface ToolLogoProps {
  name: string;
  size?: number;
}

const palette = ["#e85d5d", "#4f9dde", "#f4b942", "#6bbf76", "#a779e0", "#ef8e58"];

/** Deterministic colour + initials, so every tool gets a stable sketchy badge. */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function initials(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AI";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * A generated, hand-drawn-style "logo" badge for a tool. Avoids using
 * real (copyrighted) brand logos while still giving each tool a
 * recognisable, colourful identity.
 */
export default function ToolLogo({ name, size = 96 }: ToolLogoProps) {
  const h = hash(name);
  const color = palette[h % palette.length];
  const text = initials(name);

  return (
    <svg
      className="tool-logo"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${name} badge`}
    >
      <path
        d="M12 8 L88 6 Q94 6 93 14 L95 86 Q95 93 86 92 L14 94 Q7 94 8 86 L6 14 Q6 8 12 8 Z"
        fill={color}
        stroke="#2b2b2b"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="50"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="'Patrick Hand', cursive"
        fontSize="38"
        fill="#fdf6e3"
        stroke="#2b2b2b"
        strokeWidth="1"
      >
        {text}
      </text>
    </svg>
  );
}
