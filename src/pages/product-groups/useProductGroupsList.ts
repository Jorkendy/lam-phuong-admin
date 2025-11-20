/**
 * Hook for fetching and managing product groups list
 */

import { useMemo, useEffect } from 'react'
import { useProductGroups } from '@/hooks/useProductGroups'

export function useProductGroupsList() {
  const {
    productGroups,
    isLoading,
    error: productGroupsError,
    invalidateCache,
  } = useProductGroups()

  // Convert error to string format
  const error = useMemo(() => {
    if (!productGroupsError) return null
    return productGroupsError instanceof Error
      ? productGroupsError.message
      : 'Failed to load product groups'
  }, [productGroupsError])

  // Check if cached data is missing Status field and invalidate if needed
  useEffect(() => {
    if (!isLoading && productGroups.length > 0) {
      const hasMissingStatus = productGroups.some(pg => !('Status' in pg.fields))
      if (hasMissingStatus) {
        console.warn('[ProductGroupsList] Detected missing Status field in cached data, invalidating cache...')
        invalidateCache()
      }
    }
  }, [productGroups, isLoading, invalidateCache])

  return {
    productGroups,
    isLoading,
    error,
    invalidateCache,
  }
}

