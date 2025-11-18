export interface JobType {
  id: string;
  name: string;
  slug: string;
}

export interface CreateJobTypeRequest {
  name: string;
}

export interface CreateJobTypeResponse {
  data: JobType;
  message: string;
  success: true;
}

export interface JobTypesResponse {
  data: JobType[];
  message: string;
  success: true;
}

export interface DeleteJobTypeResponse {
  data: string;
  message: string;
  success: true;
}

export interface JobTypeError {
  error: {
    code: string;
    details?: Record<string, unknown>;
    message: string;
  };
  message: string;
  success: false;
}

