import { Box, Card, CardContent, Grid, Typography, Avatar } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PageHeader from '../components/common/PageHeader';
import { palette } from '../theme';

const stats = [
  {
    title: 'Alunos',
    icon: <PeopleIcon sx={{ fontSize: 28 }} />,
    color: palette.navy[600],
    gradient: `linear-gradient(135deg, ${palette.navy[600]} 0%, ${palette.navy[700]} 100%)`,
    bgGradient: `linear-gradient(135deg, ${palette.navy[50]} 0%, ${palette.navy[100]} 100%)`,
    description: 'Cadastro e gestao',
  },
  {
    title: 'Turmas',
    icon: <ClassIcon sx={{ fontSize: 28 }} />,
    color: palette.navy[600],
    gradient: `linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)`,
    bgGradient: `linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)`,
    description: 'Organizacao escolar',
  },
  {
    title: 'Professores',
    icon: <SchoolIcon sx={{ fontSize: 28 }} />,
    color: palette.emerald[600],
    gradient: `linear-gradient(135deg, ${palette.emerald[500]} 0%, ${palette.emerald[600]} 100%)`,
    bgGradient: `linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)`,
    description: 'Em breve',
  },
];

function DashboardPage() {
  return (
    <Box>
      <PageHeader titulo="Inicio" descricao="Visao geral do sistema escolar." />

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Card
              className={`animate-in stagger-${index + 1}`}
              sx={{
                height: '100%',
                cursor: 'pointer',
                overflow: 'visible',
                position: 'relative',
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
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 16, color: 'grey.400' }} />
                  </Box>
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
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Bem-vindo ao Persistema
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600 }}>
          Sistema de gestao escolar para a secretaria digital. Cadastre alunos, organize turmas e gerencie a vida escolar de forma simples e moderna.
        </Typography>
      </Box>
    </Box>
  );
}

export default DashboardPage;
