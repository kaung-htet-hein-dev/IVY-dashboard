import { Branch } from "@/types/branch";
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
import { BranchFormData, FormMode } from "../types";
import { useBranchForm } from "../hooks/useBranchForm";
import { BranchFormFields } from "./BranchFormFields";

interface BranchFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormData) => Promise<void>;
  initialData?: Branch;
  mode: FormMode;
  isLoading?: boolean;
}

export const BranchForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
  isLoading = false
}: BranchFormProps) => {
  const { register, handleSubmit, errors, reset, control } = useBranchForm({
    initialData,
    open
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: BranchFormData) => {
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
        {mode === "create" ? "Create Branch" : "Edit Branch"}
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
          <BranchFormFields
            register={register}
            errors={errors}
            disabled={isLoading}
            control={control}
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
