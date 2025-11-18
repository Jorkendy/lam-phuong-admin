import { getToken } from "./auth";
import type {
  JobCategory,
  CreateJobCategoryRequest,
  CreateJobCategoryResponse,
  JobCategoriesResponse,
  DeleteJobCategoryResponse,
  JobCategoryError,
} from "@/types/job-category";

const API_BASE_URL = process.env.NEXT_PUBLIC_LP_API_URL;

export async function getJobCategories(token?: string): Promise<JobCategory[]> {
  if (!API_BASE_URL) {
    // Return empty array if API is not configured (for development)
    return [];
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const authToken = token || (typeof window !== "undefined" ? getToken() : null);
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/job-categories`, {
      headers,
      cache: "no-store",
    });

    // Handle 404 as empty array (no job categories exist yet)
    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      // Try to parse error response
      try {
        const errorData = (await response.json()) as JobCategoryError;
        if ("error" in errorData && errorData.error?.message) {
          throw new Error(errorData.error.message);
        }
      } catch {
        // If error parsing fails, use status code
      }
      throw new Error(`Failed to fetch job categories: ${response.status}`);
    }

    const data = (await response.json()) as JobCategoriesResponse | JobCategoryError;

    if ("success" in data && data.success && "data" in data) {
      return data.data;
    }

    // If response format is unexpected but status is OK, return empty array
    return [];
  } catch (error) {
    // If it's a known error, rethrow it
    if (error instanceof Error && error.message === "Unauthorized") {
      throw error;
    }
    // For other errors (network, etc.), return empty array to prevent page crash
    console.error("Error fetching job categories:", error);
    return [];
  }
}

export async function createJobCategory(
  jobCategory: CreateJobCategoryRequest,
  token?: string
): Promise<JobCategory> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const authToken = token || (typeof window !== "undefined" ? getToken() : null);
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/job-categories`, {
    method: "POST",
    headers,
    body: JSON.stringify(jobCategory),
  });

  const data = (await response.json()) as CreateJobCategoryResponse | JobCategoryError;

  if (!response.ok) {
    if ("error" in data) {
      throw new Error(data.error.message || "Failed to create job category");
    }
    throw new Error("Failed to create job category");
  }

  if ("success" in data && data.success && "data" in data) {
    return data.data;
  }

  throw new Error("Invalid response format");
}

export async function deleteJobCategory(
  slug: string,
  token?: string
): Promise<void> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const authToken = token || (typeof window !== "undefined" ? getToken() : null);
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/job-categories/${slug}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    const errorData = (await response.json()) as JobCategoryError;
    if ("error" in errorData) {
      throw new Error(errorData.error.message || "Failed to delete job category");
    }
    throw new Error(`Failed to delete job category: ${response.status}`);
  }

  const data = (await response.json()) as DeleteJobCategoryResponse | JobCategoryError;

  if ("success" in data && !data.success) {
    if ("error" in data) {
      throw new Error(data.error.message || "Failed to delete job category");
    }
    throw new Error("Failed to delete job category");
  }
}

