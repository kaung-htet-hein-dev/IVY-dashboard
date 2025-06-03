import { PageContainer } from "@/components/common/PageContainer";
import { DataTable } from "@/components/common/DataTable";
import { useUsers } from "./hooks/useUsers";
import { UserForm } from "./components/UserForm";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export default function UsersPage() {
  const {
    users,
    isLoading,
    columns,
    formState,
    handleCloseForm,
    handleSubmit,
    deleteState,
    handleCancelDelete,
    handleConfirmDelete
  } = useUsers();

  return (
    <PageContainer title="Users">
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        pageSize={10}
      />

      <UserForm
        open={formState.isOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={formState.user || undefined}
        isLoading={formState.isLoading}
      />

      <ConfirmationDialog
        open={deleteState.isOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteState.user?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteState.isLoading}
      />
    </PageContainer>
  );
}
