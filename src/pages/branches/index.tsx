import { PageContainer } from "@/components/common/PageContainer";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { BranchForm } from "./components/BranchForm";
import { useBranches } from "./hooks/useBranches";

export default function BranchesPage() {
  const {
    branches,
    isLoading,
    columns,
    handleCreate,
    formState,
    handleCloseForm,
    handleSubmit,
    deleteState,
    handleCancelDelete,
    handleConfirmDelete
  } = useBranches();

  return (
    <PageContainer title="Branches">
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Create Branch
        </Button>
      </Box>
      <DataTable
        data={branches}
        columns={columns}
        isLoading={isLoading}
        pageSize={10}
      />
      <BranchForm
        open={formState.mode !== null}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={formState.branch}
        mode={formState.mode || "create"}
        isLoading={formState.isLoading}
      />
      <ConfirmationDialog
        open={deleteState.isOpen}
        title="Delete Branch"
        message={`Are you sure you want to delete ${deleteState.branch?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteState.isLoading}
      />
    </PageContainer>
  );
}
