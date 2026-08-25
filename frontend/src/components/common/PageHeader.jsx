import { Box, Typography } from '@mui/material';

function PageHeader({ titulo, descricao, acao }) {
  return (
    <Box
      className="animate-in"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {titulo}
        </Typography>
        {descricao && (
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5, fontWeight: 400 }}>
            {descricao}
          </Typography>
        )}
      </Box>
      {acao}
    </Box>
  );
}

export default PageHeader;
