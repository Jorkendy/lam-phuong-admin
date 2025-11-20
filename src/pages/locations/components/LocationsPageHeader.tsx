/**
 * Header component for Locations page
 */

import { Button } from '@/components/ui/button'

interface LocationsPageHeaderProps {
  selectedCount: number
  onDeleteClick: () => void
  onCreateClick: () => void
}

export function LocationsPageHeader({ selectedCount, onDeleteClick, onCreateClick }: LocationsPageHeaderProps) {
  return (
    <div className="border-b border-border bg-white backdrop-blur supports-[backdrop-filter]:bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Locations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your location database
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedCount > 0 && (
              <Button 
                onClick={onDeleteClick}
                variant="destructive"
                size="lg"
                className="shadow-md hover:shadow-lg transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                Delete ({selectedCount})
              </Button>
            )}
            <Button 
              onClick={onCreateClick}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Create Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

