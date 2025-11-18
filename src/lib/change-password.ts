import { getToken } from "./auth";
import type { User } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_LP_API_URL;

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  data: User;
  message: string;
  success: true;
}

export interface ChangePasswordError {
  error: {
    code: string;
    details?: Record<string, unknown>;
    message: string;
  };
  message: string;
  success: false;
}

export async function changePassword(
  credentials: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(credentials),
  });

  const data = (await response.json()) as ChangePasswordResponse | ChangePasswordError;

  if (!response.ok) {
    if ("error" in data) {
      throw new Error(data.error.message || "Failed to change password");
    }
    throw new Error("Failed to change password");
  }

  if ("success" in data && data.success) {
    return data;
  }

  throw new Error("Invalid response format");
}

