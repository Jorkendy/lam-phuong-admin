"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { MultiSelect } from "@/components/ui/multi-select";
import type { Location } from "@/types/location";
import type { JobCategory } from "@/types/job-category";
import type { JobType } from "@/types/job-type";
import type { ProductGroup } from "@/types/product-group";
import type { CreateRecruitmentPostRequest } from "@/types/recruitment-post";

interface CreateRecruitmentPostFormProps {
  locations: Location[];
  jobCategories: JobCategory[];
  jobTypes: JobType[];
  productGroups: ProductGroup[];
  onSubmit: (data: CreateRecruitmentPostRequest) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateRecruitmentPostForm({
  locations,
  jobCategories,
  jobTypes,
  productGroups,
  onSubmit,
  isSubmitting,
}: CreateRecruitmentPostFormProps) {
  const [formData, setFormData] = useState<CreateRecruitmentPostRequest>({
    title: "",
    description: "",
    introduce: "",
    locationId: undefined,
    jobCategoryIds: [],
    jobTypeIds: [],
    productGroupIds: [],
    salaryMin: undefined,
    salaryMax: undefined,
    salaryCurrency: "VND",
    requirements: "",
    benefits: "",
    applicationMethod: "",
    deadline: "",
    status: "draft",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả công việc là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Clean up empty strings
    const submitData: CreateRecruitmentPostRequest = {
      ...formData,
      introduce: formData.introduce || undefined,
      locationId: formData.locationId || undefined,
      jobCategoryIds: formData.jobCategoryIds && formData.jobCategoryIds.length > 0 ? formData.jobCategoryIds : undefined,
      jobTypeIds: formData.jobTypeIds && formData.jobTypeIds.length > 0 ? formData.jobTypeIds : undefined,
      productGroupIds: formData.productGroupIds && formData.productGroupIds.length > 0 ? formData.productGroupIds : undefined,
      salaryMin: formData.salaryMin || undefined,
      salaryMax: formData.salaryMax || undefined,
      requirements: formData.requirements || undefined,
      benefits: formData.benefits || undefined,
      applicationMethod: formData.applicationMethod || undefined,
      deadline: formData.deadline || undefined,
    };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ví dụ: Tuyển dụng Nhân viên Kinh doanh"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              disabled={isSubmitting}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "draft" | "published" | "closed") =>
                setFormData({ ...formData, status: value })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="introduce">Giới thiệu</Label>
          <Textarea
            id="introduce"
            placeholder="Giới thiệu về công ty, môi trường làm việc, văn hóa công ty..."
            value={formData.introduce || ""}
            onChange={(e) =>
              setFormData({ ...formData, introduce: e.target.value })
            }
            disabled={isSubmitting}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Mô tả công việc <span className="text-destructive">*</span>
          </Label>
          <div className={errors.description ? "border border-destructive rounded-md" : ""}>
            <MarkdownEditor
              value={formData.description}
              onChange={(value) => {
                setFormData({ ...formData, description: value });
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              placeholder="Mô tả chi tiết về công việc, trách nhiệm, yêu cầu..."
              disabled={isSubmitting}
            />
          </div>
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Chi tiết công việc</h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="locationId">Địa điểm</Label>
            <Select
              value={formData.locationId || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, locationId: value || undefined })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="locationId">
                <SelectValue placeholder="Chọn địa điểm" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobCategoryIds">Danh mục công việc</Label>
            <MultiSelect
              options={jobCategories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              selected={formData.jobCategoryIds || []}
              onChange={(selected) =>
                setFormData({ ...formData, jobCategoryIds: selected })
              }
              placeholder="Chọn danh mục"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTypeIds">Loại công việc</Label>
            <MultiSelect
              options={jobTypes.map((type) => ({
                label: type.name,
                value: type.id,
              }))}
              selected={formData.jobTypeIds || []}
              onChange={(selected) =>
                setFormData({ ...formData, jobTypeIds: selected })
              }
              placeholder="Chọn loại công việc"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productGroupIds">Nhóm sản phẩm</Label>
            <MultiSelect
              options={productGroups.map((group) => ({
                label: group.name,
                value: group.id,
              }))}
              selected={formData.productGroupIds || []}
              onChange={(selected) =>
                setFormData({ ...formData, productGroupIds: selected })
              }
              placeholder="Chọn nhóm sản phẩm"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>


      {/* Requirements & Benefits */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="requirements">Yêu cầu công việc</Label>
          <MarkdownEditor
            value={formData.requirements || ""}
            onChange={(value) =>
              setFormData({ ...formData, requirements: value })
            }
            placeholder="Liệt kê các yêu cầu về kinh nghiệm, kỹ năng, bằng cấp..."
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="benefits">Quyền lợi</Label>
          <MarkdownEditor
            value={formData.benefits || ""}
            onChange={(value) =>
              setFormData({ ...formData, benefits: value })
            }
            placeholder="Liệt kê các quyền lợi như bảo hiểm, phụ cấp, đào tạo..."
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Application Method */}
      <div className="space-y-2">
        <Label htmlFor="applicationMethod">Cách thức ứng tuyển</Label>
        <Textarea
          id="applicationMethod"
          placeholder="Hướng dẫn cách ứng viên nộp hồ sơ, email, địa chỉ, form ứng tuyển..."
          value={formData.applicationMethod || ""}
          onChange={(e) =>
            setFormData({ ...formData, applicationMethod: e.target.value })
          }
          disabled={isSubmitting}
          rows={6}
        />
      </div>

      {/* Deadline */}
      <div className="space-y-2">
        <Label htmlFor="deadline">Hạn nộp hồ sơ</Label>
        <Input
          id="deadline"
          type="date"
          value={formData.deadline || ""}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          disabled={isSubmitting}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            "Đang lưu..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Lưu bài tuyển dụng
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

