import { useState } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { LocationFormDialog } from '@/components/LocationFormDialog'
import { useLocationsList } from './locations/useLocationsList'
import { useLocationFilters } from './locations/useLocationFilters'
import { useLocationMutations } from './locations/useLocationMutations'
import { LocationsPageHeader } from './locations/components/LocationsPageHeader'
import { LocationsSearchBar } from './locations/components/LocationsSearchBar'
import { LocationsList } from './locations/components/LocationsList'
import { LoadingSkeleton } from './locations/components/LoadingSkeleton'
import { EmptyState } from './locations/components/EmptyState'
import { ErrorState } from './locations/components/ErrorState'
import { DeleteConfirmDialog } from './locations/components/DeleteConfirmDialog'
import { STATUS_FILTER_OPTIONS } from './locations/locations-constants'

export function LocationsPage() {
  const { locations, isLoading, error, invalidateCache } = useLocationsList()
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredLocations,
    handleClearSearch,
    handleClearFilters,
  } = useLocationFilters(locations)
  const {
    error: mutationError,
    deleting,
    togglingIds,
    handleCreateLocation,
    handleDeleteLocations,
    handleToggleActive,
  } = useLocationMutations({ invalidateCache })

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
      await handleDeleteLocations(idsToDelete)
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
    filteredLocations.forEach(loc => newSelectedIds.add(loc.id))
    setSelectedIds(newSelectedIds)
  }

  const handleDeselectAll = () => {
    const newSelectedIds = new Set(selectedIds)
    filteredLocations.forEach(loc => newSelectedIds.delete(loc.id))
    setSelectedIds(newSelectedIds)
  }

  const displayError = error || mutationError
  const hasActiveFilters = searchQuery !== '' || statusFilter !== STATUS_FILTER_OPTIONS.ALL

  return (
    <AppLayout>
      <div className="min-h-full bg-[#f9fafb]">
        <LocationsPageHeader
          selectedCount={selectedIds.size}
          onDeleteClick={() => handleDeleteClick(Array.from(selectedIds))}
          onCreateClick={() => setIsDialogOpen(true)}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isLoading && locations.length === 0 ? (
            <LoadingSkeleton />
          ) : displayError ? (
            <ErrorState error={displayError} onRetry={invalidateCache} />
          ) : locations.length === 0 ? (
            <EmptyState
              type="no-locations"
              onCreateClick={() => setIsDialogOpen(true)}
            />
          ) : filteredLocations.length === 0 ? (
            <EmptyState
              type="no-results"
              onClearFilters={handleClearFilters}
              hasFilters={hasActiveFilters}
            />
          ) : (
            <>
              {locations.length > 0 && (
                <LocationsSearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClearSearch={handleClearSearch}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  totalCount={locations.length}
                  filteredCount={filteredLocations.length}
                  hasActiveFilters={hasActiveFilters}
                />
              )}
              <LocationsList
                locations={filteredLocations}
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
      <LocationFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={async (fields) => {
          await handleCreateLocation(fields)
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
