import type { ErrorResponse } from "../types/ErrorResponse";

export function isErrorResponse(error: unknown): error is ErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number" &&
    "error" in error &&
    typeof error.error === "string"
  );
}
