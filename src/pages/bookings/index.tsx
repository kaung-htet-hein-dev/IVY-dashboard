import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import BookingList from "./BookingList";
import BookingForm from "./BookingForm";
import { useBookings } from "./useBookings";

export default function BookingsPage() {
  const {
    form,
    bookings,
    services,
    branches,
    users,
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
  } = useBookings();

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
        <Typography variant="h4">Bookings</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModalOpen}
        >
          Add Booking
        </Button>
      </Box>

      <BookingList
        bookings={bookings}
        services={services}
        branches={branches}
        users={users}
        isLoading={isLoading}
        onEdit={handleEditModalOpen}
        onDelete={handleDeleteDialogOpen}
      />

      <FormModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title="Create Booking"
        onSubmit={form.handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        <BookingForm
          form={form}
          services={services}
          branches={branches}
          users={users}
        />
      </FormModal>

      <FormModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Booking"
        onSubmit={form.handleSubmit(onEditSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        <BookingForm
          form={form}
          services={services}
          branches={branches}
          users={users}
        />
      </FormModal>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={onDeleteConfirm}
        title="Delete Booking"
        message="Are you sure you want to delete this booking?"
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
