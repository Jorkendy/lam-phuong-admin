/**
 * Pure utility functions for Locations
 */

import type { AirtableRecord, LocationFields } from '@/lib/airtable-api'

/**
 * Filter locations by search query
 */
export function filterBySearch(
  locations: AirtableRecord<LocationFields>[],
  searchQuery: string
): AirtableRecord<LocationFields>[] {
  if (!searchQuery.trim()) {
    return locations
  }

  const query = searchQuery.toLowerCase()
  return locations.filter((location) => {
    const name = location.fields.Name?.toLowerCase() ?? ''
    return name.includes(query)
  })
}

/**
 * Filter locations by status
 */
export function filterByStatus(
  locations: AirtableRecord<LocationFields>[],
  statusFilter: string
): AirtableRecord<LocationFields>[] {
  if (statusFilter === 'all') {
    return locations
  }

  return locations.filter((location) => location.fields.Status === statusFilter)
}

/**
 * Apply all filters to locations
 */
export function applyFilters(
  locations: AirtableRecord<LocationFields>[],
  searchQuery: string,
  statusFilter: string
): AirtableRecord<LocationFields>[] {
  let filtered = locations
  filtered = filterBySearch(filtered, searchQuery)
  filtered = filterByStatus(filtered, statusFilter)
  return filtered
}

/**
 * Format date for display
 */
export function formatCreatedDate(createdTime: string): string {
  return new Date(createdTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

