import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { UserButton } from "@clerk/nextjs";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1
}));

interface HeaderProps {
  onMenuClick: () => void;
  isMobile?: boolean;
}

export const Header = ({ onMenuClick, isMobile }: HeaderProps) => {
  const theme = useTheme();

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
        <UserButton afterSignOutUrl="/login" />
      </Toolbar>
    </StyledAppBar>
  );
};
