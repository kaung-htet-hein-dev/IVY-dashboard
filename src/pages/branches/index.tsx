import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import BranchList from "./BranchList";
import BranchForm from "./BranchForm";
import { useBranches } from "./useBranches";

export default function BranchesPage() {
  const {
    form,
    branches,
    selectedBranch,
    isLoading,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    createMutation,
    updateMutation,
    deleteMutation,
    handleCreateModalOpen,
    handleCreateModalClose,
    handleEditModalOpen,
    handleEditModalClose,
    handleDeleteDialogOpen,
    handleDeleteDialogClose,
    onCreateSubmit,
    onEditSubmit,
    onDeleteConfirm
  } = useBranches();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
        }}
      >
        <Typography variant="h4">Branches</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModalOpen}
        >
          Add Branch
        </Button>
      </Box>

      <BranchList
        branches={branches}
        isLoading={isLoading}
        onEdit={handleEditModalOpen}
        onDelete={handleDeleteDialogOpen}
      />

      <FormModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title="Create Branch"
        onSubmit={form.handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        <BranchForm form={form} />
      </FormModal>

      <FormModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Branch"
        onSubmit={form.handleSubmit(onEditSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        <BranchForm form={form} />
      </FormModal>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={onDeleteConfirm}
        title="Delete Branch"
        message={`Are you sure you want to delete ${selectedBranch?.name}?`}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
