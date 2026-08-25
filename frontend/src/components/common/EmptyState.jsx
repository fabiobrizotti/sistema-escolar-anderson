import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

function EmptyState({ titulo = 'Nenhum registro encontrado', descricao }) {
  return (
    <Box
      className="animate-in"
      sx={{
        textAlign: 'center',
        py: 8,
        px: 4,
        borderRadius: 4,
        border: '2px dashed',
        borderColor: 'divider',
        backgroundColor: 'rgba(0,0,0,0.01)',
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <InboxIcon sx={{ fontSize: 36, color: 'grey.300' }} />
      </Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
        {titulo}
      </Typography>
      {descricao && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
          {descricao}
        </Typography>
      )}
    </Box>
  );
}

export default EmptyState;
