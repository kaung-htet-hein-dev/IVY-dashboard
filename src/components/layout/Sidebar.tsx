import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  useMediaQuery,
  ListItemButton
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  MiscellaneousServices as ServicesIcon,
  BookOnline as BookingIcon
} from "@mui/icons-material";
import { useRouter } from "next/router";

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Users", icon: <PeopleIcon />, path: "/users" },
  { text: "Categories", icon: <CategoryIcon />, path: "/categories" },
  { text: "Branches", icon: <StoreIcon />, path: "/branches" },
  { text: "Services", icon: <ServicesIcon />, path: "/services" },
  { text: "Bookings", icon: <BookingIcon />, path: "/bookings" }
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawer = (
    <>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={router.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "& .MuiListItemIcon-root": {
                    color: "white"
                  },
                  "&:hover": {
                    backgroundColor: "primary.dark"
                  }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color: router.pathname === item.path ? "white" : "inherit"
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box"
        }
      }}
    >
      {drawer}
    </Drawer>
  );
}
