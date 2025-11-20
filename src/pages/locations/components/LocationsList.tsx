/**
 * List component for displaying locations in a grid
 */

import type { AirtableRecord, LocationFields } from '@/lib/airtable-api'
import { LocationCard } from './LocationCard'

interface LocationsListProps {
  locations: AirtableRecord<LocationFields>[]
  selectedIds: Set<string>
  togglingIds: Set<string>
  onToggleSelect: (id: string) => void
  onDeleteClick: (id: string) => void
  onToggleActive: (id: string, currentStatus: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function LocationsList({
  locations,
  selectedIds,
  togglingIds,
  onToggleSelect,
  onDeleteClick,
  onToggleActive,
  onSelectAll,
  onDeselectAll,
}: LocationsListProps) {
  const allSelected = locations.length > 0 && locations.every(loc => selectedIds.has(loc.id))
  const selectedCount = locations.filter(loc => selectedIds.has(loc.id)).length

  return (
    <>
      {/* Select All Section */}
      {locations.length > 0 && (
        <div className="mb-6 flex items-center gap-4 px-4 py-3 bg-[#f9fafb] rounded-lg border border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => {
                if (allSelected) {
                  onDeselectAll()
                } else {
                  onSelectAll()
                }
              }}
              className="w-6 h-6 rounded-md transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
            <span className="text-sm font-medium text-foreground">
              Select all ({selectedCount} of {locations.length} selected)
            </span>
          </label>
        </div>
      )}
      <div className="grid gap-6 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            isSelected={selectedIds.has(location.id)}
            isToggling={togglingIds.has(location.id)}
            onSelect={onToggleSelect}
            onDelete={onDeleteClick}
            onToggleActive={onToggleActive}
          />
        ))}
      </div>
    </>
  )
}

