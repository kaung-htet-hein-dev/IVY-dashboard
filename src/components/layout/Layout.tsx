import {
  Box,
  styled,
  useMediaQuery,
  Theme,
  CircularProgress
} from "@mui/material";
import { useState, ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Header } from "./Header";
import { Drawer } from "./Drawer";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UnauthorizedAccessWarning } from "@/components/auth/UnauthorizedAccessWarning";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
  isMobile?: boolean;
}>(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: 0,
  ...(open &&
    !isMobile && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    }),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2)
  }
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end"
}));

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error
  } = useCurrentUser();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  // Show loading while Clerk is loading or user data is loading
  if (!isLoaded || (isSignedIn && isUserLoading)) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user is signed in and we have user data, check their role
  if (isSignedIn && currentUser) {
    // If user role is "USER", show warning and logout
    if (currentUser.role === "USER") {
      return <UnauthorizedAccessWarning />;
    }
  }

  // If there's an error fetching user data, show warning
  if (isSignedIn && error) {
    return <UnauthorizedAccessWarning />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Header onMenuClick={handleDrawerToggle} />
      <Drawer
        open={isMobile ? mobileOpen : open}
        onDrawerClose={handleDrawerToggle}
        variant={isMobile ? "temporary" : "permanent"}
      />
      <Main open={open} isMobile={isMobile}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};
