// Common types for API responses and error handling
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Error class for API errors
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

// Helper functions for API requests
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    const errorMessage = errorData.message || "An error occurred";
    throw new ApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return data.data || data;
}

// Get auth headers with token
export function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Base API URL configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
