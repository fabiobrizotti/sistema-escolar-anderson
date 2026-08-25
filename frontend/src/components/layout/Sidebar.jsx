import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';

const DRAWER_WIDTH = 260;

const menuItems = [
  { key: '/', label: 'Inicio', icon: <HomeIcon /> },
  { key: '/alunos', label: 'Alunos', icon: <PeopleIcon /> },
  { key: '/turmas', label: 'Turmas', icon: <ClassIcon /> },
  { key: '/professores', label: 'Professores', icon: <SchoolIcon /> },
  { key: '/financeiro', label: 'Financeiro', icon: <AttachMoneyIcon /> },
  { key: '/relatorios', label: 'Relatorios', icon: <AssessmentIcon /> },
];

function SidebarItem({ item, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate(item.key);
    onNavigate();
  };

  return (
    <ListItemButton
      selected={location.pathname === item.key}
      onClick={handleClick}
      sx={{ borderRadius: 2, mb: 0.5 }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItemButton>
  );
}

function Sidebar({ mobileOpen, onToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigate = () => {
    if (isMobile) onToggle();
  };

  const content = (
    <Box>
      <Toolbar>
        <Typography variant="h6" fontWeight={700} color="primary">
          Sistema Escolar
        </Typography>
      </Toolbar>
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <SidebarItem key={item.key} item={item} onNavigate={handleNavigate} />
        ))}
      </List>
    </Box>
  );

  if (!isMobile) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
      }}
    >
      {content}
    </Drawer>
  );
}

export default Sidebar;
