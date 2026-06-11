import { useNavigate } from "react-router-dom";
import type { Category } from "../types";

interface CategoryCardProps {
  category: Category;
  /** position in the grid, used to stagger the entrance animation */
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const navigate = useNavigate();
  const go = () => navigate(`/category/${category.id}`);

  // a tiny peek at a few tools inside the category
  const preview = category.tools.slice(0, 3).map((t) => t.name);

  return (
    <div
      className="sketch-box cat-card pop-in"
      style={{ animationDelay: `${Math.min(index, 12) * 55}ms` }}
      role="button"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      }}
    >
      <span className="cat-card__icon">{category.icon}</span>
      <h2 className="cat-card__name">{category.name}</h2>
      <p className="cat-card__tagline">{category.tagline}</p>
      <div className="cat-card__preview">
        {preview.map((name) => (
          <span key={name} className="cat-card__pill">
            {name}
          </span>
        ))}
      </div>
      <div className="cat-card__footer">
        <span className="sketch-tag tag-freemium cat-card__count">
          {category.tools.length} tools
        </span>
        <span className="cat-card__arrow">Explore →</span>
      </div>
    </div>
  );
}
