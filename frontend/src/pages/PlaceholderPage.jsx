import { Box, Typography, Avatar } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import PageHeader from '../components/common/PageHeader';
import { palette } from '../theme';

function PlaceholderPage({ titulo, descricao }) {
  return (
    <Box>
      <PageHeader titulo={titulo} />
      <Box
        className="animate-in"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
          px: 4,
          borderRadius: 4,
          border: '2px dashed',
          borderColor: `${palette.navy[200]}`,
          backgroundColor: `${palette.navy[50]}40`,
          textAlign: 'center',
        }}
      >
        <Avatar
          sx={{
            width: 72,
            height: 72,
            background: `linear-gradient(135deg, ${palette.navy[100]}, ${palette.navy[200]})`,
            color: palette.navy[500],
            mb: 3,
          }}
        >
          <ConstructionIcon sx={{ fontSize: 36 }} />
        </Avatar>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: palette.navy[900] }}>
          {titulo}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 420, lineHeight: 1.7 }}>
          {descricao || 'Esta area estara disponivel na proxima etapa do sistema escolar.'}
        </Typography>
      </Box>
    </Box>
  );
}

export default PlaceholderPage;
