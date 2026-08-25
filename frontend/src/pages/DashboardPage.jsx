import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';
import PageHeader from '../components/common/PageHeader';

const stats = [
  { title: 'Alunos', icon: <PeopleIcon sx={{ fontSize: 40 }} />, color: '#1565c0' },
  { title: 'Turmas', icon: <ClassIcon sx={{ fontSize: 40 }} />, color: '#7b1fa2' },
  { title: 'Professores', icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: '#2e7d32' },
];

function DashboardPage() {
  return (
    <Box>
      <PageHeader titulo="Inicio" descricao="Visao geral do sistema escolar." />

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ color: stat.color, mb: 2 }}>{stat.icon}</Box>
                <Typography variant="h5" fontWeight={700}>
                  {stat.title}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Gestao de {stat.title.toLowerCase()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DashboardPage;
