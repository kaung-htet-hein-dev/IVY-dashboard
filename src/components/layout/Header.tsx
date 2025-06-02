import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Menu,
  MenuItem,
  styled
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/useAuthStore";
import { endpoints } from "@/api/endpoints";
import { axiosInstance } from "@/api/axios";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1
}));

interface HeaderProps {
  onMenuClick: () => void;
  isMobile?: boolean;
}

export const Header = ({ onMenuClick, isMobile }: HeaderProps) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuthStore();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post(endpoints.logout);
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    handleClose();
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: isMobile ? "1.1rem" : undefined
          }}
        >
          IVY Admin
        </Typography>
        <Box>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              sx={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32 }}
            >
              A
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};
