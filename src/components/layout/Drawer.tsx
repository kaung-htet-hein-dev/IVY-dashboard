import {
  BookOnline,
  Business,
  Category,
  ChevronLeft,
  ChevronRight,
  MiscellaneousServices,
  People
} from "@mui/icons-material";
import {
  Box,
  CSSObject,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  styled,
  Theme,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useRouter } from "next/router";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

const StyledPermanentDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

const menuItems = [
  { text: "Users", icon: <People />, path: "/users" },
  { text: "Branches", icon: <Business />, path: "/branches" },
  { text: "Categories", icon: <Category />, path: "/categories" },
  { text: "Bookings", icon: <BookOnline />, path: "/bookings" },
  { text: "Services", icon: <MiscellaneousServices />, path: "/services" }
];

interface DrawerProps {
  open: boolean;
  onDrawerClose: () => void;
  variant?: "permanent" | "temporary";
}

export const Drawer = ({
  open,
  onDrawerClose,
  variant = "permanent"
}: DrawerProps) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <DrawerHeader>
        <IconButton onClick={onDrawerClose}>
          {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </DrawerHeader>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent:
                  variant === "permanent" && !open ? "center" : "initial",
                px: 2.5
              }}
              onClick={() => {
                router.push(item.path);
                if (isMobile) {
                  onDrawerClose();
                }
              }}
              selected={router.pathname === item.path}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: variant === "permanent" && !open ? "auto" : 3,
                  justifyContent: "center"
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: variant === "permanent" && !open ? 0 : 1,
                  display: variant === "permanent" && !open ? "none" : "block"
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (variant === "temporary") {
    return (
      <MuiDrawer
        variant="temporary"
        open={open}
        onClose={onDrawerClose}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth
          }
        }}
      >
        {drawer}
      </MuiDrawer>
    );
  }

  return (
    <StyledPermanentDrawer
      variant="permanent"
      open={open}
      sx={{
        display: { xs: "none", sm: "block" }
      }}
    >
      {drawer}
    </StyledPermanentDrawer>
  );
};
