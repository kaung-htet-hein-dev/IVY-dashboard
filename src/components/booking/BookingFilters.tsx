import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export interface BookingFilters {
  status: string;
  bookedDate: Date | null;
}

interface BookingFiltersProps {
  filters: BookingFilters;
  onFilterChange: (filters: BookingFilters) => void;
}

const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

export const BookingFilters = ({
  filters,
  onFilterChange
}: BookingFiltersProps) => {
  return (
    <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          value={filters.status}
          label="Status"
          onChange={(e) =>
            onFilterChange({ ...filters, status: e.target.value })
          }
        >
          <MenuItem value="">All</MenuItem>
          {BOOKING_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePicker
        label="Booked Date"
        value={filters.bookedDate}
        onChange={(date) => onFilterChange({ ...filters, bookedDate: date })}
        slotProps={{
          textField: {
            sx: { minWidth: 200 },
            InputProps: {
              endAdornment: filters.bookedDate ? (
                <Box
                  component="span"
                  sx={{ cursor: "pointer", mr: 2 }}
                  onClick={() =>
                    onFilterChange({ ...filters, bookedDate: null })
                  }
                >
                  ✕
                </Box>
              ) : null
            }
          }
        }}
      />
    </Box>
  );
};
