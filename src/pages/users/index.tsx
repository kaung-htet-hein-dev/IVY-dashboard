import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import UserList from "./UserList";
import UserForm from "./UserForm";
import { useUsers } from "./useUsers";

export default function UsersPage() {
  const {
    form,
    users,
    selectedUser,
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
  } = useUsers();

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
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModalOpen}
        >
          Add User
        </Button>
      </Box>

      <UserList
        users={users}
        isLoading={isLoading}
        onEdit={handleEditModalOpen}
        onDelete={handleDeleteDialogOpen}
      />

      <FormModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title="Create User"
        onSubmit={form.handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        <UserForm form={form} />
      </FormModal>

      <FormModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit User"
        onSubmit={form.handleSubmit(onEditSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        <UserForm form={form} />
      </FormModal>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={onDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}?`}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
