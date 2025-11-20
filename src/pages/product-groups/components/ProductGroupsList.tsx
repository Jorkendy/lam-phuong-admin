/**
 * List component for displaying product groups in a grid
 */

import type { AirtableRecord, ProductGroupFields } from '@/lib/airtable-api'
import { ProductGroupCard } from './ProductGroupCard'

interface ProductGroupsListProps {
  productGroups: AirtableRecord<ProductGroupFields>[]
  selectedIds: Set<string>
  togglingIds: Set<string>
  onToggleSelect: (id: string) => void
  onDeleteClick: (id: string) => void
  onToggleActive: (id: string, currentStatus: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function ProductGroupsList({
  productGroups,
  selectedIds,
  togglingIds,
  onToggleSelect,
  onDeleteClick,
  onToggleActive,
  onSelectAll,
  onDeselectAll,
}: ProductGroupsListProps) {
  const allSelected = productGroups.length > 0 && productGroups.every(pg => selectedIds.has(pg.id))
  const selectedCount = productGroups.filter(pg => selectedIds.has(pg.id)).length

  return (
    <>
      {/* Select All Section */}
      {productGroups.length > 0 && (
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
              Select all ({selectedCount} of {productGroups.length} selected)
            </span>
          </label>
        </div>
      )}
      <div className="grid gap-6 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productGroups.map((productGroup) => (
          <ProductGroupCard
            key={productGroup.id}
            productGroup={productGroup}
            isSelected={selectedIds.has(productGroup.id)}
            isToggling={togglingIds.has(productGroup.id)}
            onSelect={onToggleSelect}
            onDelete={onDeleteClick}
            onToggleActive={onToggleActive}
          />
        ))}
      </div>
    </>
  )
}

