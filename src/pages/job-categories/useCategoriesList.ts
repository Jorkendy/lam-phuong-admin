/**
 * Hook for fetching and managing job categories list
 */

import { useMemo } from 'react'
import { useJobCategories } from '@/hooks/useJobCategories'

export function useCategoriesList() {
  const {
    jobCategories,
    isLoading,
    error: jobCategoriesError,
    invalidateCache,
  } = useJobCategories()

  // Convert error to string format
  const error = useMemo(() => {
    if (!jobCategoriesError) return null
    return jobCategoriesError instanceof Error
      ? jobCategoriesError.message
      : 'Failed to load job categories'
  }, [jobCategoriesError])

  return {
    jobCategories,
    isLoading,
    error,
    invalidateCache,
  }
}

