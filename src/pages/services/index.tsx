import { PageContainer } from "@/components/common/PageContainer";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { ServiceForm } from "./components/ServiceForm";
import { useServices } from "./hooks/useServices";

export default function ServicesPage() {
  const {
    services,
    isLoading,
    columns,
    handleCreate,
    formState,
    handleCloseForm,
    handleSubmit,
    deleteState,
    handleCancelDelete,
    handleConfirmDelete
  } = useServices();

  return (
    <PageContainer title="Services">
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          disabled={formState.isLoading || deleteState.isLoading}
        >
          Create Service
        </Button>
      </Box>

      <DataTable
        data={services}
        columns={columns}
        isLoading={isLoading}
        pageSize={10}
      />

      <ServiceForm
        open={formState.mode !== null}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={formState.service ?? undefined}
        mode={formState.mode || "create"}
        isLoading={formState.isLoading}
      />

      <ConfirmationDialog
        open={deleteState.isOpen}
        title="Delete Service"
        message={`Are you sure you want to delete ${deleteState.service?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteState.isLoading}
      />
    </PageContainer>
  );
}
