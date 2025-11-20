import { useState } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { ProductGroupFormDialog } from '@/components/ProductGroupFormDialog'
import { useProductGroupsList } from './product-groups/useProductGroupsList'
import { useProductGroupFilters } from './product-groups/useProductGroupFilters'
import { useProductGroupMutations } from './product-groups/useProductGroupMutations'
import { ProductGroupsPageHeader } from './product-groups/components/ProductGroupsPageHeader'
import { ProductGroupsSearchBar } from './product-groups/components/ProductGroupsSearchBar'
import { ProductGroupsList } from './product-groups/components/ProductGroupsList'
import { LoadingSkeleton } from './product-groups/components/LoadingSkeleton'
import { EmptyState } from './product-groups/components/EmptyState'
import { ErrorState } from './product-groups/components/ErrorState'
import { DeleteConfirmDialog } from './product-groups/components/DeleteConfirmDialog'
import { STATUS_FILTER_OPTIONS } from './product-groups/product-groups-constants'

export function ProductGroupsPage() {
  const { productGroups, isLoading, error, invalidateCache } = useProductGroupsList()
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredProductGroups,
    handleClearSearch,
    handleClearFilters,
  } = useProductGroupFilters(productGroups)
  const {
    error: mutationError,
    deleting,
    togglingIds,
    handleCreateProductGroup,
    handleDeleteProductGroups,
    handleToggleActive,
  } = useProductGroupMutations({ invalidateCache })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; ids: string[] }>({ open: false, ids: [] })

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleDeleteClick = (ids: string[]) => {
    setDeleteConfirm({ open: true, ids })
  }

  const handleDeleteConfirm = async () => {
    const idsToDelete = deleteConfirm.ids
    if (idsToDelete.length === 0) return

    try {
      await handleDeleteProductGroups(idsToDelete)
      setSelectedIds(new Set())
      setDeleteConfirm({ open: false, ids: [] })
    } catch {
      setDeleteConfirm({ open: false, ids: [] })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, ids: [] })
  }

  const handleSelectAll = () => {
    const newSelectedIds = new Set(selectedIds)
    filteredProductGroups.forEach(pg => newSelectedIds.add(pg.id))
    setSelectedIds(newSelectedIds)
  }

  const handleDeselectAll = () => {
    const newSelectedIds = new Set(selectedIds)
    filteredProductGroups.forEach(pg => newSelectedIds.delete(pg.id))
    setSelectedIds(newSelectedIds)
  }

  const displayError = error || mutationError
  const hasActiveFilters = searchQuery !== '' || statusFilter !== STATUS_FILTER_OPTIONS.ALL

  return (
    <AppLayout>
      <div className="min-h-full bg-[#f9fafb]">
        <ProductGroupsPageHeader
          selectedCount={selectedIds.size}
          onDeleteClick={() => handleDeleteClick(Array.from(selectedIds))}
          onCreateClick={() => setIsDialogOpen(true)}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isLoading && productGroups.length === 0 ? (
            <LoadingSkeleton />
          ) : displayError ? (
            <ErrorState error={displayError} onRetry={invalidateCache} />
          ) : productGroups.length === 0 ? (
            <EmptyState
              type="no-product-groups"
              onCreateClick={() => setIsDialogOpen(true)}
            />
          ) : filteredProductGroups.length === 0 ? (
            <EmptyState
              type="no-results"
              onClearFilters={handleClearFilters}
              hasFilters={hasActiveFilters}
            />
          ) : (
            <>
              {productGroups.length > 0 && (
                <ProductGroupsSearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClearSearch={handleClearSearch}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  totalCount={productGroups.length}
                  filteredCount={filteredProductGroups.length}
                  hasActiveFilters={hasActiveFilters}
                />
              )}
              <ProductGroupsList
                productGroups={filteredProductGroups}
                selectedIds={selectedIds}
                togglingIds={togglingIds}
                onToggleSelect={handleToggleSelect}
                onDeleteClick={(id) => handleDeleteClick([id])}
                onToggleActive={(id, status) => handleToggleActive(id, status)}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
              />
            </>
          )}
        </div>
      </div>
      <ProductGroupFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={async (fields) => {
          await handleCreateProductGroup(fields)
          setIsDialogOpen(false)
        }}
      />
      <DeleteConfirmDialog
        open={deleteConfirm.open}
        ids={deleteConfirm.ids}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </AppLayout>
  )
}
