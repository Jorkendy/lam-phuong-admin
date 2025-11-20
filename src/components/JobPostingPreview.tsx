import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { Button } from '@/components/ui/button'
import { type JobPostingFields, type AirtableRecord } from '@/lib/airtable-api'
import { type LocationFields, type JobCategoryFields, type JobTypeFields, type ProductGroupFields } from '@/lib/airtable-api'

interface JobPostingPreviewProps {
  formData: JobPostingFields
  locations: AirtableRecord<LocationFields>[]
  jobCategories: AirtableRecord<JobCategoryFields>[]
  jobTypes: AirtableRecord<JobTypeFields>[]
  productGroups: AirtableRecord<ProductGroupFields>[]
}

export function JobPostingPreview({
  formData,
  locations,
  jobCategories,
  jobTypes,
  productGroups,
}: JobPostingPreviewProps) {
  // Get location name
  const selectedLocation = formData['Khu vực']
    ? locations.find(loc => loc.id === formData['Khu vực'])
    : null
  const locationName = selectedLocation?.fields.Name || null

  // Get category names
  const selectedCategories = formData['Danh mục công việc']
    ? jobCategories.filter(cat => formData['Danh mục công việc']?.includes(cat.id))
    : []
  const categoryNames = selectedCategories.map(cat => cat.fields.Name || '').filter(Boolean)

  // Get job type names
  const selectedJobTypes = formData['Loại công việc']
    ? jobTypes.filter(type => formData['Loại công việc']?.includes(type.id))
    : []
  const jobTypeNames = selectedJobTypes.map(type => type.fields.Name || '').filter(Boolean)

  // Get product group names
  const selectedProductGroups = formData['Nhóm sản phẩm']
    ? productGroups.filter(group => formData['Nhóm sản phẩm']?.includes(group.id))
    : []
  const productGroupNames = selectedProductGroups.map(group => group.fields.Name || '').filter(Boolean)

  // Combine all tags
  const allTags = [
    ...categoryNames,
    ...jobTypeNames,
    ...productGroupNames,
  ].filter(Boolean)

  const title = formData['Tiêu đề'] || 'Untitled Job Opening'
  const introduction = formData['Giới thiệu'] || ''
  const jobDescription = formData['Mô tả công việc'] || ''
  const requirements = formData['Yêu cầu'] || ''
  const benefits = formData['Quyền lợi'] || ''
  const applicationMethod = formData['Cách thức ứng tuyển'] || ''

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Preview</h3>
          <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded">Live</span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">
            {title}
          </h1>
          
          {/* Tags and Location */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 5).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
                {allTags.length > 5 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    +{allTags.length - 5} more
                  </span>
                )}
              </div>
            )}
            
            {/* Location */}
            {locationName && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
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
                  className="text-destructive"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm font-medium">{locationName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Introduction */}
        {introduction && (
          <div className="mb-6">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {introduction}
            </p>
          </div>
        )}

        {/* Job Description Section */}
        {jobDescription && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#3b82f6] mb-4">Job Description</h2>
            <div className="prose prose-sm max-w-none text-foreground">
              <MarkdownRenderer content={jobDescription} />
            </div>
          </div>
        )}

        {/* Requirements Section */}
        {requirements && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#3b82f6] mb-4">Requirements</h2>
            <div className="prose prose-sm max-w-none text-foreground">
              <MarkdownRenderer content={requirements} />
            </div>
          </div>
        )}

        {/* Benefits Section */}
        {benefits && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#3b82f6] mb-4">Benefits</h2>
            <div className="prose prose-sm max-w-none text-foreground">
              <MarkdownRenderer content={benefits} />
            </div>
          </div>
        )}

        {/* Application Method */}
        {applicationMethod && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">How to Apply</h2>
            <div className="prose prose-sm max-w-none text-foreground">
              <MarkdownRenderer content={applicationMethod} />
            </div>
          </div>
        )}

        {/* Deadline */}
        {formData['Hạn chót nhận'] && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
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
                className="text-yellow-600"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                Deadline: {(() => {
                  try {
                    const date = new Date(formData['Hạn chót nhận']);
                    if (!isNaN(date.getTime())) {
                      return date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      });
                    }
                  } catch (e) {
                    // Fallback to raw value if date parsing fails
                  }
                  return formData['Hạn chót nhận'];
                })()}
              </span>
            </div>
          </div>
        )}

        {/* Apply Now Button */}
        <div className="mt-8 pt-6 border-t border-border">
          <Button
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-6 text-lg"
            disabled
          >
            Apply Now
          </Button>
        </div>

        {/* Empty State */}
        {!title && !introduction && !jobDescription && !requirements && !benefits && (
          <div className="text-center py-12 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 opacity-50"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-sm">Start filling in the form to see the preview</p>
          </div>
        )}
      </div>
    </div>
  )
}

