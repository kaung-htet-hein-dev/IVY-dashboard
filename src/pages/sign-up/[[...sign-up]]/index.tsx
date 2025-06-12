import { Box, Container } from "@mui/material";
import { SignUp } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in page since sign-up is disabled for admin dashboard
    router.replace("/sign-in");
  }, [router]);

  return null;

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
