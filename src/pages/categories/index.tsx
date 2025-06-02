import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import { useCategories } from "./useCategories";

export default function CategoriesPage() {
  const {
    form,
    categories,
    selectedCategory,
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
  } = useCategories();

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
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModalOpen}
        >
          Add Category
        </Button>
      </Box>

      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEditModalOpen}
        onDelete={handleDeleteDialogOpen}
      />

      <FormModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title="Create Category"
        onSubmit={form.handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        <CategoryForm form={form} />
      </FormModal>

      <FormModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Category"
        onSubmit={form.handleSubmit(onEditSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        <CategoryForm form={form} />
      </FormModal>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={onDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete ${selectedCategory?.name}?`}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
