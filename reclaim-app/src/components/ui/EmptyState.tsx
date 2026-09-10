/**
 * Empty State Component
 * Modern empty states with illustrations
 */

import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`empty-state ${className}`}>
      <Icon className="empty-state-icon" />
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// Preset empty states for common scenarios
export function EmptyJournal({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <EmptyState
      icon={require('lucide-react').BookOpen}
      title="No entries yet"
      description="Start documenting your experiences to build your evidence timeline"
      action={
        onCreateClick && (
          <button onClick={onCreateClick} className="btn-primary">
            Create First Entry
          </button>
        )
      }
    />
  )
}

export function EmptySearch() {
  return (
    <EmptyState
      icon={require('lucide-react').Search}
      title="No results found"
      description="Try adjusting your search terms or filters"
    />
  )
}

export function EmptyData() {
  return (
    <EmptyState
      icon={require('lucide-react').Database}
      title="No data available"
      description="Data will appear here once you start using this feature"
    />
  )
}
