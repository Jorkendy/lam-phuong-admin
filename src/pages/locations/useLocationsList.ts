/**
 * Hook for fetching and managing locations list
 */

import { useState, useEffect } from 'react'
import { useLocations } from '@/hooks/useLocations'
import type { AirtableRecord, LocationFields } from '@/lib/airtable-api'

export function useLocationsList() {
  const { locations: locationsData, isLoading, error: locationsError, invalidateCache } = useLocations()
  const [error, setError] = useState<string | null>(null)

  // Use locations directly from hook
  const locations = locationsData

  // Set error from hook
  useEffect(() => {
    if (locationsError) {
      setError(locationsError instanceof Error ? locationsError.message : 'Failed to load locations')
    }
  }, [locationsError])

  return {
    locations,
    isLoading,
    error,
    invalidateCache,
  }
}

