/**
 * Pure utility functions for Product Groups
 */

import type { AirtableRecord, ProductGroupFields } from '@/lib/airtable-api'

/**
 * Filter product groups by search query
 */
export function filterBySearch(
  productGroups: AirtableRecord<ProductGroupFields>[],
  searchQuery: string
): AirtableRecord<ProductGroupFields>[] {
  if (!searchQuery.trim()) {
    return productGroups
  }

  const query = searchQuery.toLowerCase()
  return productGroups.filter((productGroup) => {
    const name = productGroup.fields.Name?.toLowerCase() ?? ''
    return name.includes(query)
  })
}

/**
 * Filter product groups by status
 */
export function filterByStatus(
  productGroups: AirtableRecord<ProductGroupFields>[],
  statusFilter: string
): AirtableRecord<ProductGroupFields>[] {
  if (statusFilter === 'all') {
    return productGroups
  }

  return productGroups.filter((productGroup) => {
    const status = productGroup.fields.Status || productGroup.fields.status || 'Active'
    return status === statusFilter || (statusFilter === 'Active' && (status === 'Active' || status === 'active'))
  })
}

/**
 * Apply all filters to product groups
 */
export function applyFilters(
  productGroups: AirtableRecord<ProductGroupFields>[],
  searchQuery: string,
  statusFilter: string
): AirtableRecord<ProductGroupFields>[] {
  let filtered = productGroups
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

