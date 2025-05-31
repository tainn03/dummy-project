// API response and request types

// Standard API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Filter options for API queries
export interface FilterOptions {
  status?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// API error interface
export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, unknown>;
}
