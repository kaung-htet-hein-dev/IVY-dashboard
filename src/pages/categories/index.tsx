import { PageContainer } from "@/components/common/PageContainer";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { CategoryForm } from "./components/CategoryForm";
import { useCategories } from "./hooks/useCategories";

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    columns,
    handleCreate,
    formState,
    handleCloseForm,
    handleSubmit,
    deleteState,
    handleCancelDelete,
    handleConfirmDelete,
    pagination,
    setPagination
  } = useCategories();

  return (
    <PageContainer title="Categories">
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          disabled={formState.isLoading || deleteState.isLoading}
        >
          Create Category
        </Button>
      </Box>

      <DataTable
        data={categories?.data || []}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={categories?.pagination.total || 0}
      />

      <CategoryForm
        open={formState.mode !== null}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={formState.category}
        mode={formState.mode || "create"}
        isLoading={formState.isLoading}
      />

      <ConfirmationDialog
        open={deleteState.isOpen}
        title="Delete Category"
        message={`Are you sure you want to delete ${deleteState.category?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteState.isLoading}
      />
    </PageContainer>
  );
}
