import { Box, Paper, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

function PlaceholderPage({ titulo, descricao }) {
  return (
    <Box>
      <PageHeader titulo={titulo} />
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography color="text.secondary">
          {descricao || 'Esta area estara disponivel na proxima etapa do sistema escolar.'}
        </Typography>
      </Paper>
    </Box>
  );
}

export default PlaceholderPage;
