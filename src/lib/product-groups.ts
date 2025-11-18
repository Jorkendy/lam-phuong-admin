import { getToken } from "./auth";
import type {
  ProductGroup,
  CreateProductGroupRequest,
  CreateProductGroupResponse,
  ProductGroupsResponse,
  DeleteProductGroupResponse,
  ProductGroupError,
} from "@/types/product-group";

const API_BASE_URL = process.env.NEXT_PUBLIC_LP_API_URL;

export async function getProductGroups(token?: string): Promise<ProductGroup[]> {
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
    const response = await fetch(`${API_BASE_URL}/product-groups`, {
      headers,
      cache: "no-store",
    });

    // Handle 404 as empty array (no product groups exist yet)
    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      // Try to parse error response
      try {
        const errorData = (await response.json()) as ProductGroupError;
        if ("error" in errorData && errorData.error?.message) {
          throw new Error(errorData.error.message);
        }
      } catch {
        // If error parsing fails, use status code
      }
      throw new Error(`Failed to fetch product groups: ${response.status}`);
    }

    const data = (await response.json()) as ProductGroupsResponse | ProductGroupError;

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
    console.error("Error fetching product groups:", error);
    return [];
  }
}

export async function createProductGroup(
  productGroup: CreateProductGroupRequest,
  token?: string
): Promise<ProductGroup> {
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

  const response = await fetch(`${API_BASE_URL}/product-groups`, {
    method: "POST",
    headers,
    body: JSON.stringify(productGroup),
  });

  const data = (await response.json()) as CreateProductGroupResponse | ProductGroupError;

  if (!response.ok) {
    if ("error" in data) {
      throw new Error(data.error.message || "Failed to create product group");
    }
    throw new Error("Failed to create product group");
  }

  if ("success" in data && data.success && "data" in data) {
    return data.data;
  }

  throw new Error("Invalid response format");
}

export async function deleteProductGroup(
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

  const response = await fetch(`${API_BASE_URL}/product-groups/${slug}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    const errorData = (await response.json()) as ProductGroupError;
    if ("error" in errorData) {
      throw new Error(errorData.error.message || "Failed to delete product group");
    }
    throw new Error(`Failed to delete product group: ${response.status}`);
  }

  const data = (await response.json()) as DeleteProductGroupResponse | ProductGroupError;

  if ("success" in data && !data.success) {
    if ("error" in data) {
      throw new Error(data.error.message || "Failed to delete product group");
    }
    throw new Error("Failed to delete product group");
  }
}

