import { ApiErrorResponse } from "@/shared/type";
import axios from "axios";

export function parseApiError(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? "Request failed";
  }

  return "Unexpected error";
}