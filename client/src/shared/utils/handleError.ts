import { getErrorMessage } from "../helpers/getErrrorMessage";
import { showToast } from "../hooks/useToast";
import { ErrorResponse } from "../types/ErrorResponse";
import { isErrorResponse } from "./iSErrorResponse";

export function handleError(error: unknown): ErrorResponse {
  const STATUS_CODE_DEFAULT = 500;
  const ERROR_DEFAULT = "An unexpected error occurred.";

  if (isErrorResponse(error)) {
    const { statusCode, message } = error;
    const title = `Error ${statusCode}: ${getErrorMessage(statusCode)}`;
    showToast({ title, description: message, type: "error" });

    return {
      statusCode,
      error: error.error,
      message: message || "No additional details provided.",
    };
  }

  const title = `Error ${STATUS_CODE_DEFAULT}: ${ERROR_DEFAULT}`;
  showToast({
    title,
    description: (error as ErrorResponse).message,
    type: "error",
  });

  return {
    statusCode: STATUS_CODE_DEFAULT,
    error: ERROR_DEFAULT,
    message: JSON.stringify(error),
  };
}
