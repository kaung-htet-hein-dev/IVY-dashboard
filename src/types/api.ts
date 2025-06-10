import { AxiosError } from "axios";

export type ApiErrorResponse<T = any> = AxiosError<{
  code: number;
  message: string;
  data?: T;
}>;
