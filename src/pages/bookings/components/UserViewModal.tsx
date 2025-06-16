import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import { User } from "@/types/user";
import { getFormattedShowDateTime } from "@/utils/date";

interface UserViewModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  isLoading: boolean;
}

export const UserViewModal = ({
  open,
  onClose,
  user,
  isLoading
}: UserViewModalProps) => {
  const getRoleColor = (role: string) => {
    return role === "ADMIN" ? "error" : "primary";
  };

  const getGenderDisplayName = (gender: string) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent
          sx={{ display: "flex", justifyContent: "center", py: 4 }}
        >
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (!user) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography>User not found</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">User Details</Typography>
          <Chip
            label={user.role}
            color={getRoleColor(user.role)}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" gutterBottom>
            {user.first_name} {user.last_name}
          </Typography>
          <Box display="flex" gap={1} mb={3}>
            <Chip
              label={user.verified ? "Verified" : "Not Verified"}
              color={user.verified ? "success" : "warning"}
              size="small"
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
              mb: 3
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body2">{user.email}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Phone Number
              </Typography>
              <Typography variant="body2">{user.phone_number}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Gender
              </Typography>
              <Typography variant="body2">
                {getGenderDisplayName(user.gender)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Birthday
              </Typography>
              <Typography variant="body2">{user.birthday}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Created At
              </Typography>
              <Typography variant="body2">
                {getFormattedShowDateTime(user.created_at)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Updated At
              </Typography>
              <Typography variant="body2">
                {getFormattedShowDateTime(user.updated_at)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
