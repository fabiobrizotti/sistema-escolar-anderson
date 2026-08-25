import { Box, Button, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

function Header({ onToggleSidebar }) {
  const { logout } = useAuth();

  return (
    <Toolbar>
      <Box sx={{ display: { md: 'none' }, mr: 2 }}>
        <Button onClick={onToggleSidebar} color="inherit">
          Menu
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
        Administrador
      </Typography>
      <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
        Sair
      </Button>
    </Toolbar>
  );
}

export default Header;
