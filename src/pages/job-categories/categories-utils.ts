/**
 * Pure utility functions for Job Categories
 */

import type { AirtableRecord, JobCategoryFields } from '@/lib/airtable-api'

/**
 * Filter job categories by search query
 */
export function filterBySearch(
  jobCategories: AirtableRecord<JobCategoryFields>[],
  searchQuery: string
): AirtableRecord<JobCategoryFields>[] {
  if (!searchQuery.trim()) {
    return jobCategories
  }

  const query = searchQuery.toLowerCase()
  return jobCategories.filter((jobCategory) => {
    const name = jobCategory.fields.Name?.toLowerCase() ?? ''
    return name.includes(query)
  })
}

/**
 * Filter job categories by status
 */
export function filterByStatus(
  jobCategories: AirtableRecord<JobCategoryFields>[],
  statusFilter: string
): AirtableRecord<JobCategoryFields>[] {
  if (statusFilter === 'all') {
    return jobCategories
  }

  return jobCategories.filter((jobCategory) => jobCategory.fields.Status === statusFilter)
}

/**
 * Apply all filters to job categories
 */
export function applyFilters(
  jobCategories: AirtableRecord<JobCategoryFields>[],
  searchQuery: string,
  statusFilter: string
): AirtableRecord<JobCategoryFields>[] {
  let filtered = jobCategories
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

