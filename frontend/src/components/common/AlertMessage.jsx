import { Alert, Snackbar } from '@mui/material';

function AlertMessage({ mensagem, tipo = 'success', onClose }) {
  if (!mensagem) return null;

  return (
    <Snackbar
      open={Boolean(mensagem)}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={tipo} variant="filled" sx={{ width: '100%' }}>
        {mensagem}
      </Alert>
    </Snackbar>
  );
}

export default AlertMessage;
