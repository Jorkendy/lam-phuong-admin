/**
 * Hook for fetching and managing job types list
 */

import { useMemo, useEffect } from 'react'
import { useJobTypes } from '@/hooks/useJobTypes'

export function useJobTypesList() {
  const {
    jobTypes,
    isLoading,
    error: jobTypesError,
    invalidateCache,
  } = useJobTypes()

  // Convert error to string format
  const error = useMemo(() => {
    if (!jobTypesError) return null
    return jobTypesError instanceof Error
      ? jobTypesError.message
      : 'Failed to load job types'
  }, [jobTypesError])

  // Check if cached data is missing Status field and invalidate if needed
  useEffect(() => {
    if (!isLoading && jobTypes.length > 0) {
      const hasMissingStatus = jobTypes.some(jt => !('Status' in jt.fields))
      if (hasMissingStatus) {
        console.warn('[JobTypesList] Detected missing Status field in cached data, invalidating cache...')
        invalidateCache()
      }
    }
  }, [jobTypes, isLoading, invalidateCache])

  return {
    jobTypes,
    isLoading,
    error,
    invalidateCache,
  }
}

