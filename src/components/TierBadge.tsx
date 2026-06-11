import type { Tier } from "../types";

export const tierMeta: Record<Tier, { label: string; icon: string; cls: string }> = {
  top: { label: "Top Pick", icon: "🔥", cls: "tier-top" },
  strong: { label: "Strong", icon: "⭐", cls: "tier-strong" },
  average: { label: "Solid", icon: "•", cls: "tier-average" },
};

interface TierBadgeProps {
  tier: Tier;
}

export default function TierBadge({ tier }: TierBadgeProps) {
  const meta = tierMeta[tier];
  return (
    <span className={`sketch-tag tier-badge ${meta.cls}`}>
      {meta.icon} {meta.label}
    </span>
  );
}
