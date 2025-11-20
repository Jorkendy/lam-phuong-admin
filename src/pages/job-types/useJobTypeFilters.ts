/**
 * Hook for managing job type filters
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { AirtableRecord, JobTypeFields } from '@/lib/airtable-api'
import { applyFilters } from './job-types-utils'
import { STATUS_FILTER_OPTIONS, SEARCH_DEBOUNCE_MS } from './job-types-constants'

export function useJobTypeFilters(jobTypes: AirtableRecord<JobTypeFields>[]) {
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
  const filteredJobTypes = useMemo(() => {
    return applyFilters(jobTypes, debouncedSearchQuery, statusFilter)
  }, [jobTypes, debouncedSearchQuery, statusFilter])

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
    filteredJobTypes,
    handleClearSearch,
    handleClearFilters,
  }
}

