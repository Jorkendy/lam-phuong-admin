/**
 * List component for displaying job types in a grid
 */

import type { AirtableRecord, JobTypeFields } from '@/lib/airtable-api'
import { JobTypeCard } from './JobTypeCard'

interface JobTypesListProps {
  jobTypes: AirtableRecord<JobTypeFields>[]
  selectedIds: Set<string>
  togglingIds: Set<string>
  onToggleSelect: (id: string) => void
  onDeleteClick: (id: string) => void
  onToggleActive: (id: string, currentStatus: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function JobTypesList({
  jobTypes,
  selectedIds,
  togglingIds,
  onToggleSelect,
  onDeleteClick,
  onToggleActive,
  onSelectAll,
  onDeselectAll,
}: JobTypesListProps) {
  const allSelected = jobTypes.length > 0 && jobTypes.every(jt => selectedIds.has(jt.id))
  const selectedCount = jobTypes.filter(jt => selectedIds.has(jt.id)).length

  return (
    <>
      {/* Select All Section */}
      {jobTypes.length > 0 && (
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
              Select all ({selectedCount} of {jobTypes.length} selected)
            </span>
          </label>
        </div>
      )}
      <div className="grid gap-6 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {jobTypes.map((jobType) => (
          <JobTypeCard
            key={jobType.id}
            jobType={jobType}
            isSelected={selectedIds.has(jobType.id)}
            isToggling={togglingIds.has(jobType.id)}
            onSelect={onToggleSelect}
            onDelete={onDeleteClick}
            onToggleActive={onToggleActive}
          />
        ))}
      </div>
    </>
  )
}

