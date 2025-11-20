import { useState } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { JobTypeFormDialog } from '@/components/JobTypeFormDialog'
import { useJobTypesList } from './job-types/useJobTypesList'
import { useJobTypeFilters } from './job-types/useJobTypeFilters'
import { useJobTypeMutations } from './job-types/useJobTypeMutations'
import { JobTypesPageHeader } from './job-types/components/JobTypesPageHeader'
import { JobTypesSearchBar } from './job-types/components/JobTypesSearchBar'
import { JobTypesList } from './job-types/components/JobTypesList'
import { LoadingSkeleton } from './job-types/components/LoadingSkeleton'
import { EmptyState } from './job-types/components/EmptyState'
import { ErrorState } from './job-types/components/ErrorState'
import { DeleteConfirmDialog } from './job-types/components/DeleteConfirmDialog'
import { STATUS_FILTER_OPTIONS } from './job-types/job-types-constants'

export function JobTypesPage() {
  const { jobTypes, isLoading, error, invalidateCache } = useJobTypesList()
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredJobTypes,
    handleClearSearch,
    handleClearFilters,
  } = useJobTypeFilters(jobTypes)
  const {
    error: mutationError,
    deleting,
    togglingIds,
    handleCreateJobType,
    handleDeleteJobTypes,
    handleToggleActive,
  } = useJobTypeMutations({ invalidateCache })

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
      await handleDeleteJobTypes(idsToDelete)
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
    filteredJobTypes.forEach(jt => newSelectedIds.add(jt.id))
    setSelectedIds(newSelectedIds)
  }

  const handleDeselectAll = () => {
    const newSelectedIds = new Set(selectedIds)
    filteredJobTypes.forEach(jt => newSelectedIds.delete(jt.id))
    setSelectedIds(newSelectedIds)
  }

  const displayError = error || mutationError
  const hasActiveFilters = searchQuery !== '' || statusFilter !== STATUS_FILTER_OPTIONS.ALL

  return (
    <AppLayout>
      <div className="min-h-full bg-[#f9fafb]">
        <JobTypesPageHeader
          selectedCount={selectedIds.size}
          onDeleteClick={() => handleDeleteClick(Array.from(selectedIds))}
          onCreateClick={() => setIsDialogOpen(true)}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isLoading && jobTypes.length === 0 ? (
            <LoadingSkeleton />
          ) : displayError ? (
            <ErrorState error={displayError} onRetry={invalidateCache} />
          ) : jobTypes.length === 0 ? (
            <EmptyState
              type="no-job-types"
              onCreateClick={() => setIsDialogOpen(true)}
            />
          ) : filteredJobTypes.length === 0 ? (
            <EmptyState
              type="no-results"
              onClearFilters={handleClearFilters}
              hasFilters={hasActiveFilters}
            />
          ) : (
            <>
              {jobTypes.length > 0 && (
                <JobTypesSearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClearSearch={handleClearSearch}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  totalCount={jobTypes.length}
                  filteredCount={filteredJobTypes.length}
                  hasActiveFilters={hasActiveFilters}
                />
              )}
              <JobTypesList
                jobTypes={filteredJobTypes}
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
      <JobTypeFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={async (fields) => {
          await handleCreateJobType(fields)
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
