import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

function EmptyState({ titulo, descricao, compacto, acao }) {
  return (
    <Box sx={{ textAlign: 'center', py: compacto ? 3 : 6, color: 'text.secondary' }}>
      <InboxIcon sx={{ fontSize: compacto ? 32 : 48, opacity: 0.4, mb: 1 }} />
      <Typography variant={compacto ? 'subtitle1' : 'h6'} fontWeight={600}>{titulo}</Typography>
      {descricao && <Typography variant="body2" sx={{ mt: 0.5 }}>{descricao}</Typography>}
      {acao && <Box sx={{ mt: 2 }}>{acao}</Box>}
    </Box>
  );
}

export default EmptyState;
