export interface JobCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CreateJobCategoryRequest {
  name: string;
}

export interface CreateJobCategoryResponse {
  data: JobCategory;
  message: string;
  success: true;
}

export interface JobCategoriesResponse {
  data: JobCategory[];
  message: string;
  success: true;
}

export interface DeleteJobCategoryResponse {
  data: string;
  message: string;
  success: true;
}

export interface JobCategoryError {
  error: {
    code: string;
    details?: Record<string, unknown>;
    message: string;
  };
  message: string;
  success: false;
}

