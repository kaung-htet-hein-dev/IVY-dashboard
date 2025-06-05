import { PageContainer } from "@/components/common/PageContainer";
import { DataTable } from "@/components/common/DataTable";
import { useBookings } from "./hooks/useBookings";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { BookingFilters } from "./components/BookingFilters";

export default function BookingsPage() {
  const { bookings, isLoading, columns, filters, onFilterChange } =
    useBookings();

  return (
    <PageContainer title="Bookings">
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {}}
          disabled={false}
        >
          Create Booking
        </Button>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BookingFilters filters={filters} onFilterChange={onFilterChange} />
        <DataTable
          data={bookings}
          columns={columns}
          isLoading={isLoading}
          pageSize={10}
        />
      </LocalizationProvider>
    </PageContainer>
  );
}
