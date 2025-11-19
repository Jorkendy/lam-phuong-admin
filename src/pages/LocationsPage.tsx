import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLocations, type LocationFields, type AirtableRecord } from '@/lib/airtable-api'

export function LocationsPage() {
  const [locations, setLocations] = useState<AirtableRecord<LocationFields>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <AppLayout>
      <div className="min-h-full bg-background">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-foreground">Locations</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading locations...</span>
          </div>
        ) : error ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={loadLocations} className="w-full">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : locations.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No Locations Found</CardTitle>
              <CardDescription>There are no locations in the database.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <Card key={location.id}>
                <CardHeader>
                  <CardTitle>{location.fields.Name || 'Unnamed Location'}</CardTitle>
                  <CardDescription>Location Details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {location.fields.Address && (
                    <div>
                      <span className="text-sm font-medium">Address: </span>
                      <span className="text-sm text-muted-foreground">{location.fields.Address}</span>
                    </div>
                  )}
                  {location.fields.City && (
                    <div>
                      <span className="text-sm font-medium">City: </span>
                      <span className="text-sm text-muted-foreground">{location.fields.City}</span>
                    </div>
                  )}
                  {location.fields.Country && (
                    <div>
                      <span className="text-sm font-medium">Country: </span>
                      <span className="text-sm text-muted-foreground">{location.fields.Country}</span>
                    </div>
                  )}
                  {(location.fields.Latitude !== undefined || location.fields.Longitude !== undefined) && (
                    <div>
                      <span className="text-sm font-medium">Coordinates: </span>
                      <span className="text-sm text-muted-foreground">
                        {location.fields.Latitude?.toFixed(6)}, {location.fields.Longitude?.toFixed(6)}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 text-xs text-muted-foreground">
                    Created: {new Date(location.createdTime).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
    </AppLayout>
  )
}

