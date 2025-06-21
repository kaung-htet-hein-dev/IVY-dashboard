import { DataTable } from "@/components/common/DataTable";
import { PageContainer } from "@/components/common/PageContainer";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { BookingFilters } from "../../components/booking/BookingFilters";
import { BookingForm } from "../../components/booking/BookingForm";
import { UpdateBookingForm } from "../../components/booking/UpdateBookingForm";
import { useBookings } from "../../hooks/booking/useBookings";
import { UserViewModal } from "../../components/booking/UserViewModal";

export default function BookingsPage() {
  const {
    bookings,
    isLoading,
    columns,
    filters,
    onFilterChange,
    formState,
    handleCreate,
    handleCloseForm,
    handleSubmit,
    pagination,
    setPagination,
    isUserLoading,
    user,
    userModalOpen,
    handleUserClose
  } = useBookings();

  return (
    <PageContainer title="Bookings">
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          disabled={formState.isLoading}
        >
          Create Booking
        </Button>
      </Box>

      <BookingFilters filters={filters} onFilterChange={onFilterChange} />
      <DataTable
        data={bookings?.data || []}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={bookings?.pagination?.total || 0}
      />

      <BookingForm
        open={formState.mode === "create"}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        isLoading={formState.isLoading}
      />

      <UserViewModal
        open={userModalOpen}
        onClose={handleUserClose}
        user={user}
        isLoading={isUserLoading}
      />

      <UpdateBookingForm
        open={formState.mode === "edit"}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        booking={formState.booking}
        isLoading={formState.isLoading}
      />
    </PageContainer>
  );
}
