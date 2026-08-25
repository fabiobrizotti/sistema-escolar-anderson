import { Box, Button, Toolbar, Typography, Avatar, Chip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';

function Header({ onToggleSidebar }) {
  const { logout } = useAuth();

  return (
    <Toolbar
      sx={{
        px: { xs: 2, md: 4 },
        minHeight: { xs: 64, md: 72 },
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <Box sx={{ display: { md: 'none' }, mr: 1 }}>
        <Button
          onClick={onToggleSidebar}
          sx={{
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: 3,
            color: 'text.secondary',
          }}
        >
          <MenuIcon />
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Chip
        label="Administrador"
        size="small"
        sx={{
          mr: 2,
          fontWeight: 500,
          backgroundColor: 'primary.50',
          color: 'primary.700',
          border: '1px solid',
          borderColor: 'primary.100',
        }}
      />
      <Button
        color="inherit"
        startIcon={<LogoutIcon />}
        onClick={logout}
        sx={{
          borderRadius: 3,
          color: 'text.secondary',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: 'rgba(244, 63, 94, 0.08)',
            color: 'error.main',
          },
        }}
      >
        Sair
      </Button>
    </Toolbar>
  );
}

export default Header;
