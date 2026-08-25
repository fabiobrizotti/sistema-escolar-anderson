import { Box, Typography } from '@mui/material';

function PageHeader({ titulo, descricao, acao }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          {titulo}
        </Typography>
        {descricao && (
          <Typography color="text.secondary" variant="body2">
            {descricao}
          </Typography>
        )}
      </Box>
      {acao}
    </Box>
  );
}

export default PageHeader;
