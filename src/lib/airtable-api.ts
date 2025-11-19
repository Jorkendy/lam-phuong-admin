/**
 * Airtable API service for fetching data
 */

import { getValidAccessToken } from './airtable-oauth'

const AIRTABLE_API_BASE_URL = 'https://api.airtable.com/v0'

/**
 * Get Airtable base ID from environment variables
 */
function getAirtableBaseId(): string {
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID
  if (!baseId) {
    throw new Error('VITE_AIRTABLE_BASE_ID is not configured')
  }
  return baseId
}

/**
 * Get table name from environment variables or use default
 */
function getLocationsTableName(): string {
  return import.meta.env.VITE_AIRTABLE_LOCATIONS_TABLE || 'Locations'
}

/**
 * Airtable record interface
 */
export interface AirtableRecord<T = Record<string, any>> {
  id: string
  fields: T
  createdTime: string
}

/**
 * Airtable API response interface
 */
export interface AirtableResponse<T = Record<string, any>> {
  records: AirtableRecord<T>[]
  offset?: string
}

/**
 * Location fields interface
 */
export interface LocationFields {
  Name?: string
  Address?: string
  City?: string
  Country?: string
  Latitude?: number
  Longitude?: number
  [key: string]: any
}

/**
 * Fetch records from an Airtable table
 */
async function fetchAirtableRecords<T = Record<string, any>>(
  tableName: string,
  options?: {
    maxRecords?: number
    view?: string
    filterByFormula?: string
    sort?: Array<{ field: string; direction: 'asc' | 'desc' }>
  }
): Promise<AirtableResponse<T>> {
  const accessToken = await getValidAccessToken()
  if (!accessToken) {
    throw new Error('No valid access token. Please log in again.')
  }

  const baseId = getAirtableBaseId()
  const url = new URL(`${AIRTABLE_API_BASE_URL}/${baseId}/${encodeURIComponent(tableName)}`)

  if (options?.maxRecords) {
    url.searchParams.append('maxRecords', options.maxRecords.toString())
  }
  if (options?.view) {
    url.searchParams.append('view', options.view)
  }
  if (options?.filterByFormula) {
    url.searchParams.append('filterByFormula', options.filterByFormula)
  }
  if (options?.sort) {
    options.sort.forEach((sort, index) => {
      url.searchParams.append(`sort[${index}][field]`, sort.field)
      url.searchParams.append(`sort[${index}][direction]`, sort.direction)
    })
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to fetch records: ${error}`)
  }

  return response.json()
}

/**
 * Fetch all locations from Airtable
 */
export async function getLocations(options?: {
  maxRecords?: number
  view?: string
  filterByFormula?: string
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>
}): Promise<AirtableResponse<LocationFields>> {
  const tableName = getLocationsTableName()
  return fetchAirtableRecords<LocationFields>(tableName, options)
}

