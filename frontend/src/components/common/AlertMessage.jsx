import { Alert, Snackbar } from '@mui/material';

function AlertMessage({ mensagem, tipo = 'success', onClose }) {
  if (!mensagem) return null;

  return (
    <Snackbar
      open={Boolean(mensagem)}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 1, mr: 1 }}
    >
      <Alert
        onClose={onClose}
        severity={tipo}
        variant="filled"
        sx={{
          width: '100%',
          borderRadius: 3,
          fontWeight: 500,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
        }}
      >
        {mensagem}
      </Alert>
    </Snackbar>
  );
}

export default AlertMessage;
