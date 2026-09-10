/**
 * Skeleton Loader Components
 * Modern loading states to replace spinners
 */

export function SkeletonText({ className = '' }: { className?: string }) {
  return <div className={`skeleton-text ${className}`} />
}

export function SkeletonTitle({ className = '' }: { className?: string }) {
  return <div className={`skeleton-title ${className}`} />
}

export function SkeletonAvatar({ className = '' }: { className?: string }) {
  return <div className={`skeleton-avatar ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <SkeletonTitle />
      <SkeletonText />
      <SkeletonText className="w-5/6" />
      <SkeletonText className="w-4/6" />
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonAvatar />
          <div className="flex-1 space-y-2">
            <SkeletonText className="w-1/3" />
            <SkeletonText className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
