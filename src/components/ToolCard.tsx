import { useNavigate } from "react-router-dom";
import type { Pricing, Tool } from "../types";
import { slugify } from "../utils/slug";
import { resolveTier } from "../data/tiers";
import TierBadge from "./TierBadge";

const pricingClass: Record<Pricing, string> = {
  Free: "tag-free",
  Freemium: "tag-freemium",
  Paid: "tag-paid",
  "Open Source": "tag-open",
};

interface ToolCardProps {
  tool: Tool;
  categoryId: string;
}

export default function ToolCard({ tool, categoryId }: ToolCardProps) {
  const navigate = useNavigate();
  const detailPath = `/category/${categoryId}/${slugify(tool.name)}`;
  const tier = resolveTier(tool);

  const open = () => navigate(detailPath);

  return (
    <article
      className="sketch-box tool-card tool-card--link"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className="tool-card__badges">
        <TierBadge tier={tier} />
        <span className={`sketch-tag ${pricingClass[tool.pricing]}`}>
          {tool.pricing}
        </span>
      </div>
      <h3 className="tool-card__name">{tool.name}</h3>
      <p className="tool-card__desc">{tool.description}</p>
      <div className="tool-card__actions">
        <span className="tool-card__visit">Learn more</span>
        <a
          className="tool-card__ext"
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Visit site ↗
        </a>
      </div>
    </article>
  );
}
