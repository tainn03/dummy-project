/**
 * Utility to handle errors in API calls
 */

/**
 * Extract error message from various error types
 * @param error The caught error
 * @param defaultMessage Default message to return if error type is unknown
 * @returns A string error message
 */
export function extractErrorMessage(
  error: unknown,
  defaultMessage: string
): string {
  // For standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // For API error responses (assuming common structure)
  if (typeof error === "object" && error !== null) {
    // Check for axios-like error structure
    if (
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null
    ) {
      const response = error.response as Record<string, unknown>;
      if (
        "data" in response &&
        typeof response.data === "object" &&
        response.data !== null
      ) {
        const data = response.data as Record<string, unknown>;
        if ("message" in data && typeof data.message === "string") {
          return data.message;
        }
      }
      // Check for status text
      if ("statusText" in response && typeof response.statusText === "string") {
        return response.statusText;
      }
    }

    // Check for direct message property
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  // If we can't determine the error message, use the default
  return defaultMessage;
}
