import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Grid, Typography, Avatar, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import GradeIcon from '@mui/icons-material/Grade';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PageHeader from '../components/common/PageHeader';
import { palette } from '../theme';

const stats = [
  {
    title: 'Alunos',
    icon: <PeopleIcon sx={{ fontSize: 28 }} />,
    gradient: `linear-gradient(135deg, ${palette.navy[600]} 0%, ${palette.navy[700]} 100%)`,
    bgGradient: `linear-gradient(135deg, ${palette.navy[50]} 0%, ${palette.navy[100]} 100%)`,
    color: palette.navy[600],
    description: 'Cadastro e gestao',
    route: '/alunos',
    status: 'ativo',
  },
  {
    title: 'Turmas',
    icon: <ClassIcon sx={{ fontSize: 28 }} />,
    gradient: `linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)`,
    bgGradient: `linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)`,
    color: '#6d28d9',
    description: 'Organizacao escolar',
    route: '/turmas',
    status: 'ativo',
  },
  {
    title: 'Notas',
    icon: <GradeIcon sx={{ fontSize: 28 }} />,
    gradient: `linear-gradient(135deg, ${palette.gold[400]} 0%, ${palette.gold[500]} 100%)`,
    bgGradient: `linear-gradient(135deg, #fef9ee 0%, #fef3c7 100%)`,
    color: palette.gold[600],
    description: 'Boletim e notas',
    route: '/notas',
    status: 'ativo',
  },
  {
    title: 'Frequencia',
    icon: <EventAvailableIcon sx={{ fontSize: 28 }} />,
    gradient: `linear-gradient(135deg, ${palette.emerald[500]} 0%, ${palette.emerald[600]} 100%)`,
    bgGradient: `linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)`,
    color: palette.emerald[600],
    description: 'Controle de presenca',
    route: '/frequencia',
    status: 'ativo',
  },
  {
    title: 'Professores',
    icon: <SchoolIcon sx={{ fontSize: 28 }} />,
    gradient: `linear-gradient(135deg, #e11d48 0%, #be123c 100%)`,
    bgGradient: `linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)`,
    color: '#e11d48',
    description: 'Em breve',
    route: null,
    status: 'em_breve',
  },
  {
    title: 'Relatorios',
    icon: <AssessmentIcon sx={{ fontSize: 28 }} />,
    gradient: `linear-gradient(135deg, #0891b2 0%, #0e7490 100%)`,
    bgGradient: `linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)`,
    color: '#0891b2',
    description: 'Em breve',
    route: null,
    status: 'em_breve',
  },
];

function DashboardPage() {
  const navigate = useNavigate();

  const handleCardClick = (stat) => {
    if (stat.route) {
      navigate(stat.route);
    }
  };

  return (
    <Box>
      <PageHeader titulo="Inicio" descricao="Visao geral do sistema escolar." />

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Card
              className={`animate-in stagger-${Math.min(index + 1, 4)}`}
              onClick={() => handleCardClick(stat)}
              sx={{
                height: '100%',
                cursor: stat.route ? 'pointer' : 'default',
                overflow: 'visible',
                position: 'relative',
                opacity: stat.status === 'em_breve' ? 0.6 : 1,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  borderRadius: '20px 20px 0 0',
                  background: stat.gradient,
                },
                '&:hover': stat.route
                  ? {
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04)',
                      transform: 'translateY(-4px)',
                      '& .arrow-icon': { opacity: 1, transform: 'translateX(0)' },
                    }
                  : {},
              }}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: stat.bgGradient,
                      color: stat.color,
                      boxShadow: `0 8px 24px ${stat.color}15`,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  {stat.route && (
                    <Box
                      className="arrow-icon"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        backgroundColor: 'grey.50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.5,
                        transform: 'translateX(-4px)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Typography sx={{ fontSize: 18, color: 'grey.400', fontWeight: 600 }}>
                        &rarr;
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        className="animate-in stagger-4"
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${palette.navy[900]} 0%, ${palette.navy[950]} 100%)`,
          color: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Bem-vindo ao Persistema
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600 }}>
          Sistema de gestao escolar para a secretaria digital. Cadastre alunos, organize turmas, gerencie notas e controle frequencia de forma simples e moderna.
        </Typography>
      </Box>
    </Box>
  );
}

export default DashboardPage;
