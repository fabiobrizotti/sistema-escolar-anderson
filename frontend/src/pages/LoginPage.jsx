import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: '', senha: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (login(form.usuario, form.senha)) {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Stack spacing={3} alignItems="center">
          <Box textAlign="center">
            <Typography variant="h4" fontWeight={700}>
              Sistema Escolar
            </Typography>
            <Typography color="text.secondary">
              Acesso ao painel administrativo.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Usuario"
                name="usuario"
                value={form.usuario}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Senha"
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                required
              />
              <Button type="submit" variant="contained" size="large">
                Entrar
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}

export default LoginPage;
