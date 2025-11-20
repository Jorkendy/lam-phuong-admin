/**
 * Hook for managing location filters
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { AirtableRecord, LocationFields } from '@/lib/airtable-api'
import { applyFilters } from './locations-utils'
import { STATUS_FILTER_OPTIONS, SEARCH_DEBOUNCE_MS } from './locations-constants'

export function useLocationFilters(locations: AirtableRecord<LocationFields>[]) {
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
  const filteredLocations = useMemo(() => {
    return applyFilters(locations, debouncedSearchQuery, statusFilter)
  }, [locations, debouncedSearchQuery, statusFilter])

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
    filteredLocations,
    handleClearSearch,
    handleClearFilters,
  }
}

