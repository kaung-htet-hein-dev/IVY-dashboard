import { Box, Typography, Button, Container, Alert } from "@mui/material";
import { Warning, ExitToApp } from "@mui/icons-material";
import { useClerk } from "@clerk/nextjs";

export const UnauthorizedAccessWarning = () => {
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
    window.location.href = "/sign-in";
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <Box>
          <Alert
            severity="error"
            icon={<Warning fontSize="large" />}
            sx={{ mb: 3, p: 3 }}
          >
            <Typography variant="h5" component="h1" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You do not have permission to access the admin dashboard. Only
              users with ADMIN role can access this area.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will be logged out automatically for security reasons.
            </Typography>
          </Alert>

          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={<ExitToApp />}
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Logout Now
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
