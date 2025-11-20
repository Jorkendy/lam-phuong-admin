/**
 * Loading skeleton component for Locations page
 */

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <span className="mt-4 text-muted-foreground font-medium">Loading locations...</span>
    </div>
  )
}

