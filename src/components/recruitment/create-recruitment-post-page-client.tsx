"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreateRecruitmentPostForm } from "./create-recruitment-post-form";
import { RecruitmentPostPreview } from "./recruitment-post-preview";
import type { Location } from "@/types/location";
import type { JobCategory } from "@/types/job-category";
import type { JobType } from "@/types/job-type";
import type { ProductGroup } from "@/types/product-group";
import type { CreateRecruitmentPostRequest } from "@/types/recruitment-post";

interface CreateRecruitmentPostPageClientProps {
  locations: Location[];
  jobCategories: JobCategory[];
  jobTypes: JobType[];
  productGroups: ProductGroup[];
}

export function CreateRecruitmentPostPageClient({
  locations,
  jobCategories,
  jobTypes,
  productGroups,
}: CreateRecruitmentPostPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (data: CreateRecruitmentPostRequest) => {
    setIsSubmitting(true);
    try {
      // TODO: Integrate with API later
      console.log("Recruitment post data:", data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For now, just show success and redirect
      alert("Tuyển dụng đã được tạo thành công! (Demo mode - API integration pending)");
      router.push("/recruitment");
    } catch (error) {
      console.error("Error creating recruitment post:", error);
      alert("Có lỗi xảy ra khi tạo tuyển dụng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Tạo bài tuyển dụng mới</CardTitle>
              <CardDescription className="mt-1">
                Điền thông tin để tạo bài tuyển dụng mới
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
              <TabsTrigger value="preview">Xem trước</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="mt-6">
              <CreateRecruitmentPostForm
                formData={formData}
                onFormDataChange={setFormData}
                locations={locations}
                jobCategories={jobCategories}
                jobTypes={jobTypes}
                productGroups={productGroups}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
            <TabsContent value="preview" className="mt-6">
              <RecruitmentPostPreview
                formData={formData}
                locations={locations}
                jobCategories={jobCategories}
                jobTypes={jobTypes}
                productGroups={productGroups}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

