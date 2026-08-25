import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

function EmptyState({ titulo = 'Nenhum registro encontrado', descricao }) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
      <InboxIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
      <Typography variant="h6" gutterBottom>
        {titulo}
      </Typography>
      {descricao && <Typography variant="body2">{descricao}</Typography>}
    </Box>
  );
}

export default EmptyState;
