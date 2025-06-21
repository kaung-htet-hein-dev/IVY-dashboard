import { useSnackbar } from "notistack";

type NotificationType = "success" | "error" | "info" | "warning";

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = (
    message: string,
    type: NotificationType = "info"
  ) => {
    enqueueSnackbar(message, { variant: type });
  };

  return { showNotification };
};
