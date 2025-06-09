import { Box, Container } from "@mui/material";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: {
                fontSize: "16px",
                fontWeight: "600",
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0"
                }
              },
              card: {
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px"
              }
            }
          }}
        />
      </Box>
    </Container>
  );
}
