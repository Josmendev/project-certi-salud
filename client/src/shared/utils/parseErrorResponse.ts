import { ErrorResponse } from "../types/ErrorResponse";
import { getErrorMessage } from "./getErrorMessage";
import { isErrorResponse } from "./iSErrorResponse";

export function parseErrorResponse(error: unknown): ErrorResponse {
  const STATUS_CODE_DEFAULT = 500;
  const ERROR_DEFAULT = "An unexpected error occurred.";

  if (isErrorResponse(error)) {
    return {
      statusCode: error.statusCode,
      error: getErrorMessage(error.statusCode),
      message: Array.isArray(error.message)
        ? error.message.join("\n")
        : error.message || "No se proporcionaron detalles adicionales.",
    };
  }

  return {
    statusCode: STATUS_CODE_DEFAULT,
    error: ERROR_DEFAULT,
    message: typeof error === "string" ? error : JSON.stringify(error),
  };
}
