import { ApiErrorResponse } from "@/types/api";
import { enqueueSnackbar } from "notistack";

export const showErrorToastWithMessage = (error: ApiErrorResponse) => {
  enqueueSnackbar(
    error.response?.data?.message ??
      error?.message ??
      "oops! something went wrong. please check network inspector for detail and report the developer.",
    {
      variant: "error"
    }
  );
};
