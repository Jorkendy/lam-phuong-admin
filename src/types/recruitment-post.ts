export interface RecruitmentPost {
  id?: string;
  title: string;
  description: string;
  introduce?: string;
  locationId?: string;
  locationName?: string;
  jobCategoryId?: string;
  jobCategoryName?: string;
  jobTypeId?: string;
  jobTypeName?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  requirements?: string;
  benefits?: string;
  deadline?: string;
  status: "draft" | "published" | "closed";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecruitmentPostRequest {
  title: string;
  description: string;
  introduce?: string;
  locationId?: string;
  jobCategoryId?: string;
  jobTypeId?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  requirements?: string;
  benefits?: string;
  deadline?: string;
  status: "draft" | "published" | "closed";
}

