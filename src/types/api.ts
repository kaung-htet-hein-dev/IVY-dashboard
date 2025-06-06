import { AxiosResponse } from "axios";

export type ErrorResponse<T = any> = AxiosResponse<{
  code: number;
  message: string;
  data?: T;
}>;
