import { UserButton } from "@clerk/nextjs";
import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography, styled } from "@mui/material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2)
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.1rem"
  }
}));

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <StyledIconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
        >
          <MenuIcon />
        </StyledIconButton>
        <StyledTypography
          variant="h5"
          noWrap
          sx={{
            fontSize: { xs: "1.1rem", sm: "inherit" }
          }}
        >
          IVY Admin
        </StyledTypography>
        <UserButton />
      </Toolbar>
    </StyledAppBar>
  );
};
