/**
 * Hook for job type mutations (create, update, delete)
 */

import { useState } from 'react'
import {
  createJobType,
  updateJobType,
  deleteJobType,
  deleteJobTypes,
  type JobTypeFields,
} from '@/lib/airtable-api'

interface UseJobTypeMutationsProps {
  invalidateCache: () => Promise<void>
}

export function useJobTypeMutations({ invalidateCache }: UseJobTypeMutationsProps) {
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  const handleCreateJobType = async (fields: JobTypeFields) => {
    try {
      console.log('[JobTypesPage] Creating job type:', fields.Name)
      await createJobType(fields)
      console.log('[JobTypesPage] Job type created successfully, invalidating cache...')
      await invalidateCache()
      console.log('[JobTypesPage] Cache invalidated successfully')
    } catch (err) {
      console.error('[JobTypesPage] Error creating job type:', err)
      setError(err instanceof Error ? err.message : 'Failed to create job type')
      throw err
    }
  }

  const handleDeleteJobTypes = async (ids: string[]) => {
    if (ids.length === 0) return

    try {
      setDeleting(true)
      setError(null)
      
      if (ids.length === 1) {
        await deleteJobType(ids[0])
      } else {
        await deleteJobTypes(ids)
      }
      
      console.log('[JobTypesPage] Deleting job types, invalidating cache...')
      await invalidateCache()
      console.log('[JobTypesPage] Cache invalidated after delete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job type(s)')
      throw err
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (jobTypeId: string, currentStatus: string) => {
    try {
      setTogglingIds(prev => new Set(prev).add(jobTypeId))
      setError(null)
      
      const newStatus = currentStatus === "Active" ? "Disabled" : "Active"
      console.log('[JobTypesPage] Updating job type status:', jobTypeId, newStatus)
      await updateJobType(jobTypeId, { Status: newStatus })
      
      // Invalidate cache to ensure Job Postings page sees the update
      console.log('[JobTypesPage] Invalidating cache after status update...')
      await invalidateCache()
      console.log('[JobTypesPage] Cache invalidated after status update')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job type status')
      // Invalidate cache to sync with server even on error
      await invalidateCache()
    } finally {
      setTogglingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(jobTypeId)
        return newSet
      })
    }
  }

  return {
    error,
    deleting,
    togglingIds,
    handleCreateJobType,
    handleDeleteJobTypes,
    handleToggleActive,
  }
}

