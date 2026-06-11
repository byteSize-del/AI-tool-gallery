/**
 * Sketchy skeleton placeholders shown while a page's content "loads".
 */

export function CategorySkeleton() {
  return (
    <div className="sketch-box skel-card" aria-hidden="true">
      <div className="skeleton skel-icon" />
      <div className="skeleton skel-line lg" />
      <div className="skeleton skel-line" />
      <div className="skeleton skel-line sm" />
    </div>
  );
}

export function ToolSkeleton() {
  return (
    <div className="sketch-box skel-card" aria-hidden="true">
      <div className="skeleton skel-line lg" />
      <div className="skeleton skel-line" />
      <div className="skeleton skel-line" />
      <div className="skeleton skel-line sm" />
    </div>
  );
}

interface SkeletonGridProps {
  count: number;
  variant: "category" | "tool";
}

export function SkeletonGrid({ count, variant }: SkeletonGridProps) {
  const items = Array.from({ length: count });
  return (
    <div className={variant === "category" ? "grid" : "tool-grid"}>
      {items.map((_, i) =>
        variant === "category" ? (
          <CategorySkeleton key={i} />
        ) : (
          <ToolSkeleton key={i} />
        )
      )}
    </div>
  );
}
