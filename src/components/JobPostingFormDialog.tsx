import { useState, useEffect, useCallback, useMemo, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/MultiSelect";
import { SingleSelect } from "@/components/SingleSelect";
import { JobPostingPreview } from "@/components/JobPostingPreview";
import { 
  type JobPostingFields, 
  generateUniqueJobPostingSlug,
  type AirtableRecord,
} from "@/lib/airtable-api";
import { useLocations } from "@/hooks/useLocations";
import { useJobCategories } from "@/hooks/useJobCategories";
import { useJobTypes } from "@/hooks/useJobTypes";
import { useProductGroups } from "@/hooks/useProductGroups";

interface JobPostingFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (fields: JobPostingFields) => Promise<void>;
  editingPosting?: AirtableRecord<JobPostingFields> | null;
}

export function JobPostingFormDialog({
  open,
  onClose,
  onSubmit,
  editingPosting,
}: JobPostingFormDialogProps) {
  const [formData, setFormData] = useState<JobPostingFields>({
    'Tiêu đề': "",
    'Giới thiệu': "",
    'Mô tả công việc': "",
    'Yêu cầu': "",
    'Quyền lợi': "",
    'Cách thức ứng tuyển': "",
    'Hạn chót nhận': "",
    'Khu vực': undefined,
    'Danh mục công việc': [],
    'Loại công việc': [],
    'Nhóm sản phẩm': [],
  });
  const [loading, setLoading] = useState(false);
  const [generatingSlug, setGeneratingSlug] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  
  // Use the same hooks as the list page with 3-layer caching
  const { locations: locationsData, isLoading: locationsLoading, error: locationsError } = useLocations();
  const { jobCategories: jobCategoriesData, isLoading: jobCategoriesLoading, error: jobCategoriesError } = useJobCategories();
  const { jobTypes: jobTypesData, isLoading: jobTypesLoading, error: jobTypesError } = useJobTypes();
  const { productGroups: productGroupsData, isLoading: productGroupsLoading, error: productGroupsError } = useProductGroups();

  // Filter to only active records
  const activeLocations = useMemo(() => {
    return locationsData.filter(loc => loc.fields.Status === 'Active');
  }, [locationsData]);

  const activeJobCategories = useMemo(() => {
    return jobCategoriesData.filter(cat => cat.fields.Status === 'Active');
  }, [jobCategoriesData]);

  const activeJobTypes = useMemo(() => {
    return jobTypesData.filter(type => type.fields.Status === 'Active');
  }, [jobTypesData]);

  const activeProductGroups = useMemo(() => {
    return productGroupsData.filter(group => group.fields.Status === 'Active');
  }, [productGroupsData]);

  // Pre-fetch data for fields that have selected values (for edit mode)
  useEffect(() => {
    if (open && editingPosting) {
      const fields = editingPosting.fields;
      // Pre-load data if there are selected values to ensure they're visible
      if (Array.isArray(fields['Khu vực']) && fields['Khu vực'].length > 0 && activeLocations.length === 0) {
        // Data will be loaded via hook when MultiSelect opens
      }
      if (Array.isArray(fields['Danh mục công việc']) && fields['Danh mục công việc'].length > 0 && activeJobCategories.length === 0) {
        // Data will be loaded via hook when MultiSelect opens
      }
      if (Array.isArray(fields['Loại công việc']) && fields['Loại công việc'].length > 0 && activeJobTypes.length === 0) {
        // Data will be loaded via hook when MultiSelect opens
      }
      if (Array.isArray(fields['Nhóm sản phẩm']) && fields['Nhóm sản phẩm'].length > 0 && activeProductGroups.length === 0) {
        // Data will be loaded via hook when MultiSelect opens
      }
    }
  }, [open, editingPosting, activeLocations.length, activeJobCategories.length, activeJobTypes.length, activeProductGroups.length]);

  useEffect(() => {
    if (open) {
      if (editingPosting) {
        // Populate form with editing data
        const fields = editingPosting.fields;
        // Format date for input (YYYY-MM-DD)
        let deadlineDate = "";
        if (fields['Hạn chót nhận']) {
          try {
            const date = new Date(fields['Hạn chót nhận']);
            if (!isNaN(date.getTime())) {
              deadlineDate = date.toISOString().split('T')[0];
            }
          } catch (e) {
            console.error('Error parsing date:', e);
          }
        }
        
        // Handle backward compatibility: convert array to string for Khu vực
        let locationValue: string | undefined = undefined;
        if (fields['Khu vực']) {
          if (Array.isArray(fields['Khu vực'])) {
            // Take first element if array (backward compatibility)
            locationValue = fields['Khu vực'].length > 0 ? fields['Khu vực'][0] : undefined;
          } else if (typeof fields['Khu vực'] === 'string') {
            locationValue = fields['Khu vực'];
          }
        }
        
        setFormData({
          'Tiêu đề': fields['Tiêu đề'] || "",
          'Giới thiệu': fields['Giới thiệu'] || "",
          'Mô tả công việc': fields['Mô tả công việc'] || "",
          'Yêu cầu': fields['Yêu cầu'] || "",
          'Quyền lợi': fields['Quyền lợi'] || "",
          'Cách thức ứng tuyển': fields['Cách thức ứng tuyển'] || "",
          'Hạn chót nhận': deadlineDate,
          'Khu vực': locationValue,
          'Danh mục công việc': Array.isArray(fields['Danh mục công việc']) ? fields['Danh mục công việc'] : [],
          'Loại công việc': Array.isArray(fields['Loại công việc']) ? fields['Loại công việc'] : [],
          'Nhóm sản phẩm': Array.isArray(fields['Nhóm sản phẩm']) ? fields['Nhóm sản phẩm'] : [],
        });
      } else {
        // Reset form
        setFormData({
          'Tiêu đề': "",
          'Giới thiệu': "",
          'Mô tả công việc': "",
          'Yêu cầu': "",
          'Quyền lợi': "",
          'Cách thức ứng tuyển': "",
          'Hạn chót nhận': "",
          'Khu vực': undefined,
          'Danh mục công việc': [],
          'Loại công việc': [],
          'Nhóm sản phẩm': [],
        });
      }
    }
  }, [open, editingPosting]);

  // Handle fetch callbacks (no-op since data is already loaded via hooks, but kept for compatibility)
  const handleFetchLocations = useCallback(async () => {
    if (locationsError) {
      setError(locationsError instanceof Error ? locationsError.message : "Failed to load locations");
    }
  }, [locationsError]);

  const handleFetchJobCategories = useCallback(async () => {
    if (jobCategoriesError) {
      setError(jobCategoriesError instanceof Error ? jobCategoriesError.message : "Failed to load job categories");
    }
  }, [jobCategoriesError]);

  const handleFetchJobTypes = useCallback(async () => {
    if (jobTypesError) {
      setError(jobTypesError instanceof Error ? jobTypesError.message : "Failed to load job types");
    }
  }, [jobTypesError]);

  const handleFetchProductGroups = useCallback(async () => {
    if (productGroupsError) {
      setError(productGroupsError instanceof Error ? productGroupsError.message : "Failed to load product groups");
    }
  }, [productGroupsError]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData['Tiêu đề']?.trim()) {
        throw new Error("Tiêu đề is required");
      }

      // Generate unique slug from title
      setGeneratingSlug(true);
      let uniqueSlug: string;
      try {
        if (editingPosting && formData['Tiêu đề'] === editingPosting.fields['Tiêu đề']) {
          // Keep existing slug if title hasn't changed
          uniqueSlug = editingPosting.fields.Slug || await generateUniqueJobPostingSlug(formData['Tiêu đề'].trim());
        } else {
          // Generate new slug if title changed or creating new
          uniqueSlug = await generateUniqueJobPostingSlug(formData['Tiêu đề'].trim());
        }
      } catch (slugError) {
        throw new Error(
          slugError instanceof Error 
            ? `Failed to generate unique slug: ${slugError.message}`
            : "Failed to generate unique slug"
        );
      } finally {
        setGeneratingSlug(false);
      }

      // Format date to ISO 8601
      const deadlineDate = formData['Hạn chót nhận'] 
        ? new Date(formData['Hạn chót nhận']).toISOString().split('T')[0]
        : undefined;

      // Submit with all fields
      await onSubmit({
        ...formData,
        Slug: uniqueSlug,
        'Hạn chót nhận': deadlineDate,
      });
      
      // Reset form
      setFormData({
        'Tiêu đề': "",
        'Giới thiệu': "",
        'Mô tả công việc': "",
        'Yêu cầu': "",
        'Quyền lợi': "",
        'Cách thức ứng tuyển': "",
        'Hạn chót nhận': "",
        'Khu vực': undefined,
        'Danh mục công việc': [],
        'Loại công việc': [],
        'Nhóm sản phẩm': [],
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save job opening"
      );
    } finally {
      setLoading(false);
    }
  };

  // Error handling for data loading failures
  useEffect(() => {
    if (locationsError || jobCategoriesError || jobTypesError || productGroupsError) {
      const errorMessage = 
        locationsError ? (locationsError instanceof Error ? locationsError.message : "Failed to load locations") :
        jobCategoriesError ? (jobCategoriesError instanceof Error ? jobCategoriesError.message : "Failed to load job categories") :
        jobTypesError ? (jobTypesError instanceof Error ? jobTypesError.message : "Failed to load job types") :
        productGroupsError ? (productGroupsError instanceof Error ? productGroupsError.message : "Failed to load product groups") :
        null;
      
      if (errorMessage && !error) {
        // Only set error if there's no existing form error
        console.error('Data loading error:', errorMessage);
      }
    }
  }, [locationsError, jobCategoriesError, jobTypesError, productGroupsError, error]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200" />

      {/* Dialog Container */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl border-2 border-border overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="px-6 pt-6 pb-5 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/20 flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground leading-tight">
                {editingPosting ? 'Edit Job Opening' : 'New Job Opening'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {editingPosting ? 'Update job opening details' : 'Create a new job opening'}
              </p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'form'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Form Content or Preview */}
        {activeTab === 'form' ? (
          <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto py-6">
            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData['Tiêu đề'] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, 'Tiêu đề': e.target.value }))}
                placeholder="Enter job title"
                required
                disabled={loading || generatingSlug}
                className="h-10"
              />
            </div>

            {/* Introduction */}
            <div className="space-y-3">
              <Label htmlFor="introduction" className="text-sm font-medium text-foreground">
                Giới thiệu
              </Label>
              <Textarea
                id="introduction"
                value={formData['Giới thiệu'] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, 'Giới thiệu': e.target.value }))}
                placeholder="Enter introduction"
                disabled={loading}
                rows={3}
              />
            </div>

            {/* Job Description */}
            <div className="space-y-3">
              <Label htmlFor="jobDescription" className="text-sm font-medium text-foreground">
                Mô tả công việc
              </Label>
              <Textarea
                id="jobDescription"
                value={formData['Mô tả công việc'] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, 'Mô tả công việc': e.target.value }))}
                placeholder="Enter job description"
                disabled={loading}
                rows={5}
                className="font-mono text-sm"
              />
            </div>

            {/* Requirements */}
            <div className="space-y-3">
              <Label htmlFor="requirements" className="text-sm font-medium text-foreground">
                Yêu cầu
              </Label>
              <Textarea
                id="requirements"
                value={formData['Yêu cầu'] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, 'Yêu cầu': e.target.value }))}
                placeholder="Enter requirements"
                disabled={loading}
                rows={5}
                className="font-mono text-sm"
              />
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <Label htmlFor="benefits" className="text-sm font-medium text-foreground">
                Quyền lợi
              </Label>
              <Textarea
                id="benefits"
                value={formData['Quyền lợi'] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, 'Quyền lợi': e.target.value }))}
                placeholder="Enter benefits"
                disabled={loading}
                rows={5}
                className="font-mono text-sm"
              />
            </div>

            {/* Application Method */}
            <div className="space-y-3">
              <Label htmlFor="applicationMethod" className="text-sm font-medium text-foreground">
                Cách thức ứng tuyển
              </Label>
              <Textarea
                id="applicationMethod"
                value={formData['Cách thức ứng tuyển'] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, 'Cách thức ứng tuyển': e.target.value }))}
                placeholder="Enter application method"
                disabled={loading}
                rows={3}
              />
            </div>

            {/* Deadline */}
            <div className="space-y-3">
              <Label htmlFor="deadline" className="text-sm font-medium text-foreground">
                Hạn chót nhận
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData['Hạn chót nhận'] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, 'Hạn chót nhận': e.target.value }))}
                disabled={loading}
                className="h-10"
              />
            </div>

            {/* Location (Single Select) */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Khu vực
              </Label>
              <SingleSelect
                options={activeLocations.map(loc => ({
                  id: loc.id,
                  label: loc.fields.Name || 'Unnamed',
                }))}
                value={formData['Khu vực']}
                onChange={(value) => setFormData(prev => ({ ...prev, 'Khu vực': value }))}
                placeholder="Select a location..."
                disabled={loading}
                loading={locationsLoading}
                onOpen={handleFetchLocations}
              />
              {locationsError && (
                <p className="text-xs text-destructive mt-1">
                  {locationsError instanceof Error ? locationsError.message : "Failed to load locations"}
                </p>
              )}
            </div>

            {/* Multi-selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Job Categories */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Danh mục công việc
                </Label>
                <MultiSelect
                  options={activeJobCategories.map(cat => ({
                    id: cat.id,
                    label: cat.fields.Name || 'Unnamed',
                  }))}
                  value={formData['Danh mục công việc'] || []}
                  onChange={(value) => setFormData(prev => ({ ...prev, 'Danh mục công việc': value }))}
                  placeholder="Select categories..."
                  disabled={loading}
                  loading={jobCategoriesLoading}
                  onOpen={handleFetchJobCategories}
                />
                {jobCategoriesError && (
                  <p className="text-xs text-destructive mt-1">
                    {jobCategoriesError instanceof Error ? jobCategoriesError.message : "Failed to load job categories"}
                  </p>
                )}
              </div>

              {/* Job Types */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Loại công việc
                </Label>
                <MultiSelect
                  options={activeJobTypes.map(type => ({
                    id: type.id,
                    label: type.fields.Name || 'Unnamed',
                  }))}
                  value={formData['Loại công việc'] || []}
                  onChange={(value) => setFormData(prev => ({ ...prev, 'Loại công việc': value }))}
                  placeholder="Select types..."
                  disabled={loading}
                  loading={jobTypesLoading}
                  onOpen={handleFetchJobTypes}
                />
                {jobTypesError && (
                  <p className="text-xs text-destructive mt-1">
                    {jobTypesError instanceof Error ? jobTypesError.message : "Failed to load job types"}
                  </p>
                )}
              </div>

              {/* Product Groups */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Nhóm sản phẩm
                </Label>
                <MultiSelect
                  options={activeProductGroups.map(group => ({
                    id: group.id,
                    label: group.fields.Name || 'Unnamed',
                  }))}
                  value={formData['Nhóm sản phẩm'] || []}
                  onChange={(value) => setFormData(prev => ({ ...prev, 'Nhóm sản phẩm': value }))}
                  placeholder="Select product groups..."
                  disabled={loading}
                  loading={productGroupsLoading}
                  onOpen={handleFetchProductGroups}
                />
                {productGroupsError && (
                  <p className="text-xs text-destructive mt-1">
                    {productGroupsError instanceof Error ? productGroupsError.message : "Failed to load product groups"}
                  </p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
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
                  className="flex-shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="flex-1">{error}</span>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-t-2 border-border my-5" />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading || generatingSlug}
              className="px-5 h-9 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={loading || generatingSlug || !formData['Tiêu đề']?.trim()}
              className="px-5 h-9 font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              {generatingSlug ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  <span>Generating slug...</span>
                </span>
              ) : loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  <span>{editingPosting ? 'Updating...' : 'Creating...'}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span>{editingPosting ? 'Update' : 'Create'}</span>
                </span>
              )}
            </Button>
          </div>
        </form>
        ) : (
          <div className="px-6 pb-6">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto py-6">
              <JobPostingPreview
                formData={formData}
                locations={activeLocations}
                jobCategories={activeJobCategories}
                jobTypes={activeJobTypes}
                productGroups={activeProductGroups}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

