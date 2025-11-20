/**
 * Hook for job category mutations (create, update, delete)
 */

import { useState } from 'react'
import {
  createJobCategory,
  updateJobCategory,
  deleteJobCategory,
  deleteJobCategories,
  type JobCategoryFields,
} from '@/lib/airtable-api'

interface UseCategoryMutationsProps {
  invalidateCache: () => Promise<void>
}

export function useCategoryMutations({ invalidateCache }: UseCategoryMutationsProps) {
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  const handleCreateJobCategory = async (fields: JobCategoryFields) => {
    try {
      await createJobCategory(fields)
      await invalidateCache()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job category')
      throw err
    }
  }

  const handleDeleteJobCategories = async (ids: string[]) => {
    if (ids.length === 0) return

    try {
      setDeleting(true)
      setError(null)

      if (ids.length === 1) {
        await deleteJobCategory(ids[0])
      } else {
        await deleteJobCategories(ids)
      }

      await invalidateCache()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job category(s)')
      throw err
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (jobCategoryId: string, currentStatus: string) => {
    try {
      setTogglingIds((prev) => new Set(prev).add(jobCategoryId))
      setError(null)

      const newStatus = currentStatus === 'Active' ? 'Disabled' : 'Active'
      await updateJobCategory(jobCategoryId, { Status: newStatus })

      // Invalidate cache to ensure Job Postings page sees the update
      await invalidateCache()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job category status')
      // Invalidate cache to sync with server even on error
      await invalidateCache()
    } finally {
      setTogglingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(jobCategoryId)
        return newSet
      })
    }
  }

  return {
    error,
    deleting,
    togglingIds,
    handleCreateJobCategory,
    handleDeleteJobCategories,
    handleToggleActive,
  }
}

