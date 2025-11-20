/**
 * Hook for location mutations (create, update, delete)
 */

import { useState } from 'react'
import { createLocation, updateLocation, deleteLocation, deleteLocations, type LocationFields } from '@/lib/airtable-api'

interface UseLocationMutationsProps {
  invalidateCache: () => Promise<void>
}

export function useLocationMutations({ invalidateCache }: UseLocationMutationsProps) {
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  const handleCreateLocation = async (fields: LocationFields) => {
    try {
      console.log('[LocationsPage] Creating location:', fields.Name)
      await createLocation(fields)
      console.log('[LocationsPage] Location created successfully, invalidating cache...')
      await invalidateCache()
      console.log('[LocationsPage] Cache invalidated successfully')
    } catch (err) {
      console.error('[LocationsPage] Error creating location:', err)
      setError(err instanceof Error ? err.message : 'Failed to create location')
      throw err
    }
  }

  const handleDeleteLocations = async (ids: string[]) => {
    if (ids.length === 0) return

    try {
      setDeleting(true)
      setError(null)
      
      if (ids.length === 1) {
        await deleteLocation(ids[0])
      } else {
        await deleteLocations(ids)
      }
      
      console.log('[LocationsPage] Deleting locations, invalidating cache...')
      await invalidateCache()
      console.log('[LocationsPage] Cache invalidated after delete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete location(s)')
      throw err
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (locationId: string, currentStatus: string) => {
    try {
      setTogglingIds(prev => new Set(prev).add(locationId))
      setError(null)
      
      const newStatus = currentStatus === "Active" ? "Disabled" : "Active"
      console.log('[LocationsPage] Updating location status:', locationId, newStatus)
      await updateLocation(locationId, { Status: newStatus })
      
      // Invalidate cache to ensure Job Postings page sees the update
      console.log('[LocationsPage] Invalidating cache after status update...')
      await invalidateCache()
      console.log('[LocationsPage] Cache invalidated after status update')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location status')
      // Invalidate cache to sync with server even on error
      await invalidateCache()
    } finally {
      setTogglingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(locationId)
        return newSet
      })
    }
  }

  return {
    error,
    deleting,
    togglingIds,
    handleCreateLocation,
    handleDeleteLocations,
    handleToggleActive,
  }
}

