interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function DashboardSkeleton() {
  return (
    <div className="skeleton-page">
      <Skeleton className="skeleton-small" />
      <Skeleton className="skeleton-title" />
      <Skeleton className="skeleton-text" />

      <div className="skeleton-top-grid">
        <Skeleton className="skeleton-big-card" />
        <Skeleton className="skeleton-big-card" />
      </div>

      <Skeleton className="skeleton-section-title" />

      <div className="skeleton-currency-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="skeleton-currency-card" key={index} />
        ))}
      </div>

      <div className="skeleton-bottom-grid">
        <Skeleton className="skeleton-bottom-card" />
        <Skeleton className="skeleton-bottom-card" />
      </div>
    </div>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="skeleton-page">
      <Skeleton className="skeleton-small" />
      <Skeleton className="skeleton-title" />
      <Skeleton className="skeleton-text" />

      <Skeleton className="skeleton-workspace-hero" />

      <Skeleton className="skeleton-section-title" />

      <div className="skeleton-currency-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="skeleton-currency-card" key={index} />
        ))}
      </div>
    </div>
  );
}