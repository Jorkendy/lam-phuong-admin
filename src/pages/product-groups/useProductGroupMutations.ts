/**
 * Hook for product group mutations (create, update, delete)
 */

import { useState } from 'react'
import {
  createProductGroup,
  updateProductGroup,
  deleteProductGroup,
  deleteProductGroups,
  type ProductGroupFields,
} from '@/lib/airtable-api'

interface UseProductGroupMutationsProps {
  invalidateCache: () => Promise<void>
}

export function useProductGroupMutations({ invalidateCache }: UseProductGroupMutationsProps) {
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  const handleCreateProductGroup = async (fields: ProductGroupFields) => {
    try {
      console.log('[ProductGroupsPage] Creating product group:', fields.Name)
      await createProductGroup(fields)
      console.log('[ProductGroupsPage] Product group created successfully, invalidating cache...')
      await invalidateCache()
      console.log('[ProductGroupsPage] Cache invalidated successfully')
    } catch (err) {
      console.error('[ProductGroupsPage] Error creating product group:', err)
      setError(err instanceof Error ? err.message : 'Failed to create product group')
      throw err
    }
  }

  const handleDeleteProductGroups = async (ids: string[]) => {
    if (ids.length === 0) return

    try {
      setDeleting(true)
      setError(null)
      
      if (ids.length === 1) {
        await deleteProductGroup(ids[0])
      } else {
        await deleteProductGroups(ids)
      }
      
      console.log('[ProductGroupsPage] Deleting product groups, invalidating cache...')
      await invalidateCache()
      console.log('[ProductGroupsPage] Cache invalidated after delete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product group(s)')
      throw err
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (productGroupId: string, currentStatus: string) => {
    try {
      setTogglingIds(prev => new Set(prev).add(productGroupId))
      setError(null)
      
      const newStatus = currentStatus === "Active" ? "Disabled" : "Active"
      console.log('[ProductGroupsPage] Updating product group status:', productGroupId, newStatus)
      await updateProductGroup(productGroupId, { Status: newStatus })
      
      // Invalidate cache to ensure Job Postings page sees the update
      console.log('[ProductGroupsPage] Invalidating cache after status update...')
      await invalidateCache()
      console.log('[ProductGroupsPage] Cache invalidated after status update')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product group status')
      // Invalidate cache to sync with server even on error
      await invalidateCache()
    } finally {
      setTogglingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(productGroupId)
        return newSet
      })
    }
  }

  return {
    error,
    deleting,
    togglingIds,
    handleCreateProductGroup,
    handleDeleteProductGroups,
    handleToggleActive,
  }
}

