import { useState } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { JobCategoryFormDialog } from '@/components/JobCategoryFormDialog'
import { useCategoriesList } from './job-categories/useCategoriesList'
import { useCategoryFilters } from './job-categories/useCategoryFilters'
import { useCategoryMutations } from './job-categories/useCategoryMutations'
import { CategoriesPageHeader } from './job-categories/components/CategoriesPageHeader'
import { CategoriesSearchBar } from './job-categories/components/CategoriesSearchBar'
import { CategoriesList } from './job-categories/components/CategoriesList'
import { LoadingSkeleton } from './job-categories/components/LoadingSkeleton'
import { EmptyState } from './job-categories/components/EmptyState'
import { ErrorState } from './job-categories/components/ErrorState'
import { DeleteConfirmDialog } from './job-categories/components/DeleteConfirmDialog'
import { STATUS_FILTER_OPTIONS } from './job-categories/categories-constants'

export function JobCategoriesPage() {
  const { jobCategories, isLoading, error, invalidateCache } = useCategoriesList()
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredJobCategories,
    handleClearSearch,
    handleClearFilters,
  } = useCategoryFilters(jobCategories)
  const {
    error: mutationError,
    deleting,
    togglingIds,
    handleCreateJobCategory,
    handleDeleteJobCategories,
    handleToggleActive,
  } = useCategoryMutations({ invalidateCache })

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
      await handleDeleteJobCategories(idsToDelete)
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
    filteredJobCategories.forEach(jc => newSelectedIds.add(jc.id))
    setSelectedIds(newSelectedIds)
  }

  const handleDeselectAll = () => {
    const newSelectedIds = new Set(selectedIds)
    filteredJobCategories.forEach(jc => newSelectedIds.delete(jc.id))
    setSelectedIds(newSelectedIds)
  }

  const displayError = error || mutationError
  const hasActiveFilters = searchQuery !== '' || statusFilter !== STATUS_FILTER_OPTIONS.ALL

  return (
    <AppLayout>
      <div className="min-h-full bg-[#f9fafb]">
        <CategoriesPageHeader
          selectedCount={selectedIds.size}
          onDeleteClick={() => handleDeleteClick(Array.from(selectedIds))}
          onCreateClick={() => setIsDialogOpen(true)}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isLoading && jobCategories.length === 0 ? (
            <LoadingSkeleton />
          ) : displayError ? (
            <ErrorState error={displayError} onRetry={invalidateCache} />
          ) : jobCategories.length === 0 ? (
            <EmptyState
              type="no-categories"
              onCreateClick={() => setIsDialogOpen(true)}
            />
          ) : filteredJobCategories.length === 0 ? (
            <EmptyState
              type="no-results"
              onClearFilters={handleClearFilters}
              hasFilters={hasActiveFilters}
            />
          ) : (
            <>
              {jobCategories.length > 0 && (
                <CategoriesSearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClearSearch={handleClearSearch}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  totalCount={jobCategories.length}
                  filteredCount={filteredJobCategories.length}
                  hasActiveFilters={hasActiveFilters}
                />
              )}
              <CategoriesList
                jobCategories={filteredJobCategories}
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
      <JobCategoryFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={async (fields) => {
          await handleCreateJobCategory(fields)
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
