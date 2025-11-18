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
import type { Location } from "@/types/location";
import type { JobCategory } from "@/types/job-category";
import type { JobType } from "@/types/job-type";
import type { CreateRecruitmentPostRequest } from "@/types/recruitment-post";

interface CreateRecruitmentPostFormProps {
  locations: Location[];
  jobCategories: JobCategory[];
  jobTypes: JobType[];
  onSubmit: (data: CreateRecruitmentPostRequest) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateRecruitmentPostForm({
  locations,
  jobCategories,
  jobTypes,
  onSubmit,
  isSubmitting,
}: CreateRecruitmentPostFormProps) {
  const [formData, setFormData] = useState<CreateRecruitmentPostRequest>({
    title: "",
    description: "",
    introduce: "",
    locationId: undefined,
    jobCategoryId: undefined,
    jobTypeId: undefined,
    salaryMin: undefined,
    salaryMax: undefined,
    salaryCurrency: "VND",
    requirements: "",
    benefits: "",
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

    if (formData.salaryMin !== undefined && formData.salaryMax !== undefined) {
      if (formData.salaryMin > formData.salaryMax) {
        newErrors.salaryMax = "Mức lương tối đa phải lớn hơn mức lương tối thiểu";
      }
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
      jobCategoryId: formData.jobCategoryId || undefined,
      jobTypeId: formData.jobTypeId || undefined,
      salaryMin: formData.salaryMin || undefined,
      salaryMax: formData.salaryMax || undefined,
      requirements: formData.requirements || undefined,
      benefits: formData.benefits || undefined,
      deadline: formData.deadline || undefined,
    };

    await onSubmit(submitData);
  };

  const formatCurrency = (value: number | undefined): string => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const parseCurrency = (value: string): number | undefined => {
    const cleaned = value.replace(/[^\d]/g, "");
    return cleaned ? parseInt(cleaned, 10) : undefined;
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
          <Textarea
            id="description"
            placeholder="Mô tả chi tiết về công việc, trách nhiệm, yêu cầu..."
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: "" });
            }}
            disabled={isSubmitting}
            rows={8}
            className={errors.description ? "border-destructive" : ""}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Chi tiết công việc</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
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
            <Label htmlFor="jobCategoryId">Danh mục công việc</Label>
            <Select
              value={formData.jobCategoryId || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, jobCategoryId: value || undefined })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="jobCategoryId">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTypeId">Loại công việc</Label>
            <Select
              value={formData.jobTypeId || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, jobTypeId: value || undefined })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="jobTypeId">
                <SelectValue placeholder="Chọn loại công việc" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Salary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mức lương</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Lương tối thiểu (VND)</Label>
            <Input
              id="salaryMin"
              type="text"
              placeholder="Ví dụ: 10,000,000"
              value={formData.salaryMin ? formatCurrency(formData.salaryMin) : ""}
              onChange={(e) => {
                const value = parseCurrency(e.target.value);
                setFormData({ ...formData, salaryMin: value });
                if (errors.salaryMax) setErrors({ ...errors, salaryMax: "" });
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryMax">Lương tối đa (VND)</Label>
            <Input
              id="salaryMax"
              type="text"
              placeholder="Ví dụ: 20,000,000"
              value={formData.salaryMax ? formatCurrency(formData.salaryMax) : ""}
              onChange={(e) => {
                const value = parseCurrency(e.target.value);
                setFormData({ ...formData, salaryMax: value });
                if (errors.salaryMax) setErrors({ ...errors, salaryMax: "" });
              }}
              disabled={isSubmitting}
              className={errors.salaryMax ? "border-destructive" : ""}
            />
            {errors.salaryMax && (
              <p className="text-sm text-destructive">{errors.salaryMax}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryCurrency">Đơn vị tiền tệ</Label>
            <Select
              value={formData.salaryCurrency || "VND"}
              onValueChange={(value) =>
                setFormData({ ...formData, salaryCurrency: value })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="salaryCurrency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VND">VND (Việt Nam Đồng)</SelectItem>
                <SelectItem value="USD">USD (Đô la Mỹ)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Requirements & Benefits */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="requirements">Yêu cầu công việc</Label>
          <Textarea
            id="requirements"
            placeholder="Liệt kê các yêu cầu về kinh nghiệm, kỹ năng, bằng cấp..."
            value={formData.requirements || ""}
            onChange={(e) =>
              setFormData({ ...formData, requirements: e.target.value })
            }
            disabled={isSubmitting}
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="benefits">Quyền lợi</Label>
          <Textarea
            id="benefits"
            placeholder="Liệt kê các quyền lợi như bảo hiểm, phụ cấp, đào tạo..."
            value={formData.benefits || ""}
            onChange={(e) =>
              setFormData({ ...formData, benefits: e.target.value })
            }
            disabled={isSubmitting}
            rows={6}
          />
        </div>
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

