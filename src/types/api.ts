import { AxiosError } from "axios";

export type ErrorResponse<T = any> = AxiosError<{
  code: number;
  message: string;
  data?: T;
}>;
