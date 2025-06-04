import { Service, ServiceFormData } from "@/types/service";
import { FormMode } from "../types";
import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "../types";
import { ServiceFormFields } from "./ServiceFormFields";
import { useEffect } from "react";

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  initialData?: Service;
  mode: FormMode;
  isLoading?: boolean;
}

export const ServiceForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
  isLoading = false
}: ServiceFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      duration_minute: 30,
      price: 0,
      is_active: true,
      image: "",
      category_id: "",
      branch_ids: []
    }
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              name: initialData.name,
              description: initialData.description,
              duration_minute: initialData.duration_minute,
              price: initialData.price,
              is_active: initialData.is_active,
              image: initialData.image,
              category_id: initialData.category_id,
              branch_ids:
                initialData.branch_ids ||
                initialData.branches?.map((branch) => branch.id) ||
                []
            }
          : {
              name: "",
              description: "",
              duration_minute: 30,
              price: 0,
              is_active: true,
              image: "",
              category_id: "",
              branch_ids: []
            }
      );
    }
  }, [open, initialData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: ServiceFormData) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {mode === "create" ? "Create Service" : "Edit Service"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
          disabled={isLoading}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent dividers>
          <ServiceFormFields
            register={register}
            errors={errors}
            control={control}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
