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
    handleConfirmDelete,
    pagination,
    setPagination
  } = useUsers();

  return (
    <PageContainer title="Users">
      <DataTable
        data={users?.data || []}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={users?.pagination?.total || 0}
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
        message={`Are you sure you want to delete ${deleteState.user?.first_name} ${deleteState.user?.last_name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteState.isLoading}
      />
    </PageContainer>
  );
}
