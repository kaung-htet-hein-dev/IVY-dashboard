import { Layout } from "@/components/layout/Layout";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2"
    }
  },
  typography: {
    fontFamily: inter.style.fontFamily
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  }
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showDrawer =
    router.pathname.startsWith("/sign-in") ||
    router.pathname.startsWith("/sign-up");

  return (
    <ClerkProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            autoHideDuration={3000}
          >
            {!showDrawer ? (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </SnackbarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
