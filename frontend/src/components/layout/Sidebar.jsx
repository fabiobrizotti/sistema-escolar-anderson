import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import GradeIcon from '@mui/icons-material/Grade';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { palette } from '../../theme';

const DRAWER_WIDTH = 260;

const menuItems = [
  { key: '/', label: 'Inicio', icon: <HomeIcon /> },
  { key: '/alunos', label: 'Alunos', icon: <PeopleIcon /> },
  { key: '/turmas', label: 'Turmas', icon: <ClassIcon /> },
  { key: '/notas', label: 'Notas', icon: <GradeIcon /> },
  { key: '/frequencia', label: 'Frequencia', icon: <EventAvailableIcon /> },
  { key: '/professores', label: 'Professores', icon: <SchoolIcon /> },
  { key: '/financeiro', label: 'Financeiro', icon: <AttachMoneyIcon /> },
  { key: '/relatorios', label: 'Relatorios', icon: <AssessmentIcon /> },
];

const DRAWER_SX = {
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    borderRight: 'none',
    background: `linear-gradient(180deg, ${palette.navy[900]} 0%, ${palette.navy[950]} 100%)`,
    color: '#ffffff',
  },
};

function SidebarItem({ item, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === item.key;

  const handleClick = () => {
    navigate(item.key);
    onNavigate();
  };

  return (
    <ListItemButton
      selected={isActive}
      onClick={handleClick}
      sx={{
        borderRadius: 3,
        mb: 0.5,
        px: 2,
        py: 1.2,
        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
        backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: isActive ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
          color: '#ffffff',
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(255,255,255,0.12)',
          color: '#ffffff',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.16)' },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 40,
          color: 'inherit',
        }}
      >
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{
          fontSize: '0.875rem',
          fontWeight: isActive ? 600 : 400,
        }}
      />
      {isActive && (
        <Box
          sx={{
            width: 3,
            height: 24,
            borderRadius: 2,
            backgroundColor: palette.gold[400],
            ml: 1,
          }}
        />
      )}
    </ListItemButton>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: `linear-gradient(135deg, ${palette.gold[400]}, ${palette.gold[500]})`,
            fontWeight: 800,
            fontSize: '1rem',
            color: palette.navy[900],
          }}
        >
          PS
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2, color: '#ffffff' }}>
            Persistema
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>
            Sistema Escolar
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2, mb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1,
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Menu
        </Typography>
      </Box>

      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {menuItems.map((item, index) => (
          <Box key={item.key}>
            {index === 5 && (
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1, mx: 1 }} />
            )}
            <SidebarItem item={item} onNavigate={onNavigate} />
          </Box>
        ))}
      </List>

      <Box
        sx={{
          mx: 2,
          mb: 2,
          p: 2,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
          Persistema v1.0
        </Typography>
      </Box>
    </Box>
  );
}

function Sidebar({ mobileOpen, onToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigate = () => {
    if (isMobile) onToggle();
  };

  if (!isMobile) {
    return (
      <Drawer variant="permanent" sx={DRAWER_SX}>
        <SidebarContent onNavigate={handleNavigate} />
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
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          background: `linear-gradient(180deg, ${palette.navy[900]} 0%, ${palette.navy[950]} 100%)`,
          color: '#ffffff',
          borderRight: 'none',
        },
      }}
    >
      <SidebarContent onNavigate={handleNavigate} />
    </Drawer>
  );
}

export default Sidebar;
