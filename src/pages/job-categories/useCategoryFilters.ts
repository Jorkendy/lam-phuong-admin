/**
 * Hook for managing job category filters
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { AirtableRecord, JobCategoryFields } from '@/lib/airtable-api'
import { applyFilters } from './categories-utils'
import { STATUS_FILTER_OPTIONS, SEARCH_DEBOUNCE_MS } from './categories-constants'

export function useCategoryFilters(jobCategories: AirtableRecord<JobCategoryFields>[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>(STATUS_FILTER_OPTIONS.ALL)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Apply filters with useMemo for performance
  const filteredJobCategories = useMemo(() => {
    return applyFilters(jobCategories, debouncedSearchQuery, statusFilter)
  }, [jobCategories, debouncedSearchQuery, statusFilter])

  // Clear search function
  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
  }, [])

  // Clear all filters function
  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setStatusFilter(STATUS_FILTER_OPTIONS.ALL)
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredJobCategories,
    handleClearSearch,
    handleClearFilters,
  }
}

