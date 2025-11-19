import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LocationFormDialog } from '@/components/LocationFormDialog'
import { getLocations, createLocation, type LocationFields, type AirtableRecord } from '@/lib/airtable-api'

export function LocationsPage() {
  const [locations, setLocations] = useState<AirtableRecord<LocationFields>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getLocations()
      setLocations(response.records)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations')
      console.error('Error loading locations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLocation = async (fields: LocationFields) => {
    await createLocation(fields)
    // Reload locations after creating
    await loadLocations()
  }

  return (
    <AppLayout>
      <div className="min-h-full bg-background">
        <div className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Locations</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your location database
                </p>
              </div>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                size="lg"
                className="shadow-md hover:shadow-lg transition-shadow"
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
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Create Location
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <span className="mt-4 text-muted-foreground font-medium">Loading locations...</span>
          </div>
        ) : error ? (
          <Card className="max-w-md mx-auto border-destructive/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-destructive/10 w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-destructive"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <CardTitle className="text-destructive">Error Loading Locations</CardTitle>
              <CardDescription className="mt-2">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={loadLocations} className="w-full" size="lg">
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
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : locations.length === 0 ? (
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
              <Button 
                onClick={() => setIsDialogOpen(true)} 
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
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {locations.map((location) => (
              <Card 
                key={location.id}
                className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold truncate">
                          {location.fields.Name || 'Unnamed Location'}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {location.fields.Address && (
                    <div className="flex items-start gap-2 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground mt-0.5 flex-shrink-0"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="text-sm text-muted-foreground line-clamp-2">{location.fields.Address}</span>
                    </div>
                  )}
                  {(location.fields.City || location.fields.Country) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      {location.fields.City && <span>{location.fields.City}</span>}
                      {location.fields.City && location.fields.Country && <span>•</span>}
                      {location.fields.Country && <span>{location.fields.Country}</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(location.createdTime).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
      <LocationFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateLocation}
      />
    </AppLayout>
  )
}

