import { useCountUp } from "../hooks/useCountUp";

interface StatTileProps {
  value: number;
  label: string;
  suffix?: string;
  /** start counting only once content is ready */
  start?: boolean;
  /** stagger the entrance animation */
  delay?: number;
}

export default function StatTile({
  value,
  label,
  suffix = "",
  start = true,
  delay = 0,
}: StatTileProps) {
  const count = useCountUp(value, 1100, start);

  return (
    <div
      className="stat-tile pop-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="stat-tile__value">
        {count}
        {suffix}
      </span>
      <span className="stat-tile__label">{label}</span>
    </div>
  );
}
