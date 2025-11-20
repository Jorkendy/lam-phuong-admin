/**
 * Empty state components for Locations page
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  type: 'no-locations' | 'no-results'
  onCreateClick?: () => void
  onClearFilters?: () => void
  hasFilters?: boolean
}

export function EmptyState({ type, onCreateClick, onClearFilters, hasFilters }: EmptyStateProps) {
  if (type === 'no-locations') {
    return (
      <Card className="max-w-md mx-auto border-dashed">
        <CardHeader className="text-center py-12">
          <div className="mx-auto mb-4 p-4 rounded-full bg-muted w-fit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <CardTitle>No Locations Yet</CardTitle>
          <CardDescription className="mt-2">
            Get started by creating your first location
          </CardDescription>
        </CardHeader>
        <CardContent>
          {onCreateClick && (
            <Button 
              onClick={onCreateClick} 
              className="w-full" 
              size="lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Create Your First Location
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto border-dashed">
      <CardHeader className="text-center py-12">
        <div className="mx-auto mb-4 p-4 rounded-full bg-muted w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <CardTitle>No Locations Found</CardTitle>
        <CardDescription className="mt-2">
          Try adjusting your search or filter criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasFilters && onClearFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

