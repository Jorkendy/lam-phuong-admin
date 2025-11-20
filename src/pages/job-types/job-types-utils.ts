/**
 * Pure utility functions for Job Types
 */

import type { AirtableRecord, JobTypeFields } from '@/lib/airtable-api'

/**
 * Filter job types by search query
 */
export function filterBySearch(
  jobTypes: AirtableRecord<JobTypeFields>[],
  searchQuery: string
): AirtableRecord<JobTypeFields>[] {
  if (!searchQuery.trim()) {
    return jobTypes
  }

  const query = searchQuery.toLowerCase()
  return jobTypes.filter((jobType) => {
    const name = jobType.fields.Name?.toLowerCase() ?? ''
    return name.includes(query)
  })
}

/**
 * Filter job types by status
 */
export function filterByStatus(
  jobTypes: AirtableRecord<JobTypeFields>[],
  statusFilter: string
): AirtableRecord<JobTypeFields>[] {
  if (statusFilter === 'all') {
    return jobTypes
  }

  return jobTypes.filter((jobType) => {
    const status = jobType.fields.Status || jobType.fields.status || 'Active'
    return status === statusFilter || (statusFilter === 'Active' && (status === 'Active' || status === 'active'))
  })
}

/**
 * Apply all filters to job types
 */
export function applyFilters(
  jobTypes: AirtableRecord<JobTypeFields>[],
  searchQuery: string,
  statusFilter: string
): AirtableRecord<JobTypeFields>[] {
  let filtered = jobTypes
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

