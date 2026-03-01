export interface ApiResponse<T> {
  status: number;
  message: string;
  errorCode: string | null;
  data: T;
}

export type ApiErrorResponse = {
  status: number;
  message: string;
  errorCode: string;
  data: null;
};
