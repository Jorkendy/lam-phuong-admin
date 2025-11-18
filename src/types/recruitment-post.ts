export interface RecruitmentPost {
  id?: string;
  title: string;
  description: string;
  introduce?: string;
  locationId?: string;
  locationName?: string;
  jobCategoryIds?: string[];
  jobCategoryNames?: string[];
  jobTypeIds?: string[];
  jobTypeNames?: string[];
  productGroupIds?: string[];
  productGroupNames?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  requirements?: string;
  benefits?: string;
  applicationMethod?: string;
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
  jobCategoryIds?: string[];
  jobTypeIds?: string[];
  productGroupIds?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  requirements?: string;
  benefits?: string;
  applicationMethod?: string;
  deadline?: string;
  status: "draft" | "published" | "closed";
}

