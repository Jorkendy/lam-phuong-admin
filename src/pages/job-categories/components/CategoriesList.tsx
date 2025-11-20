/**
 * List component for displaying job categories in a grid
 */

import type { AirtableRecord, JobCategoryFields } from '@/lib/airtable-api'
import { CategoryCard } from './CategoryCard'

interface CategoriesListProps {
  jobCategories: AirtableRecord<JobCategoryFields>[]
  selectedIds: Set<string>
  togglingIds: Set<string>
  onToggleSelect: (id: string) => void
  onDeleteClick: (id: string) => void
  onToggleActive: (id: string, currentStatus: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function CategoriesList({
  jobCategories,
  selectedIds,
  togglingIds,
  onToggleSelect,
  onDeleteClick,
  onToggleActive,
  onSelectAll,
  onDeselectAll,
}: CategoriesListProps) {
  const allSelected = jobCategories.length > 0 && jobCategories.every(jc => selectedIds.has(jc.id))
  const selectedCount = jobCategories.filter(jc => selectedIds.has(jc.id)).length

  return (
    <>
      {/* Select All Section */}
      {jobCategories.length > 0 && (
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
              Select all ({selectedCount} of {jobCategories.length} selected)
            </span>
          </label>
        </div>
      )}
      <div className="grid gap-6 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {jobCategories.map((jobCategory) => (
          <CategoryCard
            key={jobCategory.id}
            jobCategory={jobCategory}
            isSelected={selectedIds.has(jobCategory.id)}
            isToggling={togglingIds.has(jobCategory.id)}
            onSelect={onToggleSelect}
            onDelete={onDeleteClick}
            onToggleActive={onToggleActive}
          />
        ))}
      </div>
    </>
  )
}

