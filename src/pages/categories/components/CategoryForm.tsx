import { Category } from "@/types/category";
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
import { CategoryFormData, FormMode } from "../types";
import { useCategoryForm } from "../hooks/useCategoryForm";
import { CategoryFormFields } from "./CategoryFormFields";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData?: Category;
  mode: FormMode;
  isLoading?: boolean;
}

export const CategoryForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
  isLoading = false
}: CategoryFormProps) => {
  const { register, handleSubmit, errors, reset } = useCategoryForm({
    initialData,
    open
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: CategoryFormData) => {
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
        {mode === "create" ? "Create Category" : "Edit Category"}
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
          <CategoryFormFields
            register={register}
            errors={errors}
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
