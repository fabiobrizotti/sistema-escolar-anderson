import { Box, Paper, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

function PlaceholderPage({ titulo, descricao }) {
  return (
    <Box>
      <PageHeader titulo={titulo} />
      <Paper
        variant="outlined"
        sx={{
          p: 5,
          textAlign: 'center',
          borderRadius: 4,
          borderStyle: 'dashed',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          {titulo}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
          {descricao || 'Esta area estara disponivel na proxima etapa do sistema escolar.'}
        </Typography>
      </Paper>
    </Box>
  );
}

export default PlaceholderPage;
