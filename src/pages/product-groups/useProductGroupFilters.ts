/**
 * Hook for managing product group filters
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { AirtableRecord, ProductGroupFields } from '@/lib/airtable-api'
import { applyFilters } from './product-groups-utils'
import { STATUS_FILTER_OPTIONS, SEARCH_DEBOUNCE_MS } from './product-groups-constants'

export function useProductGroupFilters(productGroups: AirtableRecord<ProductGroupFields>[]) {
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
  const filteredProductGroups = useMemo(() => {
    return applyFilters(productGroups, debouncedSearchQuery, statusFilter)
  }, [productGroups, debouncedSearchQuery, statusFilter])

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
    filteredProductGroups,
    handleClearSearch,
    handleClearFilters,
  }
}

