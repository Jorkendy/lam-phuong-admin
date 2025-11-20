/**
 * Single job category card component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { AirtableRecord, JobCategoryFields } from '@/lib/airtable-api'
import { formatCreatedDate } from '../categories-utils'

interface CategoryCardProps {
  jobCategory: AirtableRecord<JobCategoryFields>
  isSelected: boolean
  isToggling: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, currentStatus: string) => void
}

export function CategoryCard({
  jobCategory,
  isSelected,
  isToggling,
  onSelect,
  onDelete,
  onToggleActive,
}: CategoryCardProps) {
  return (
    <Card 
      className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ease-out ${
        isSelected 
          ? 'border-primary border-2 shadow-lg translate-y-0' 
          : 'border-[#e5e7eb] shadow-sm hover:border-[#d1d5db] hover:-translate-y-1 hover:shadow-lg'
      }`}
    >
      {/* Delete Button - Top Right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(jobCategory.id)
        }}
        className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 text-[#ef4444] hover:text-[#dc2626] hover:bg-red-50 flex-shrink-0 transition-all duration-200 rounded-lg z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </Button>

      <CardHeader className="pb-4 pt-6 px-6">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(jobCategory.id)}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 rounded-md flex-shrink-0 mt-1 transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-200 flex-shrink-0 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <CardTitle className="text-lg font-semibold break-words leading-tight text-foreground">
                  {jobCategory.fields.Name || 'Unnamed Job Category'}
                </CardTitle>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6">
        <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium">Status:</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleActive(jobCategory.id, jobCategory.fields.Status ?? "Active")
              }}
              disabled={isToggling}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                jobCategory.fields.Status === "Active"
                  ? 'bg-[#10b981] focus:ring-[#10b981]'
                  : 'bg-[#e5e7eb] focus:ring-gray-400'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
                  jobCategory.fields.Status === "Active" ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className={`text-xs font-medium ${
              jobCategory.fields.Status === "Active"
                ? 'text-[#10b981]'
                : 'text-muted-foreground'
            }`}>
              {jobCategory.fields.Status === "Active" ? 'Active' : 'Disabled'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-xs">
            Created {formatCreatedDate(jobCategory.createdTime)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

