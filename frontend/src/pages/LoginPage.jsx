import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    color: '#ffffff',
    '& input': { color: '#ffffff' },
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: palette.gold[400] },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
  '& .MuiInputLabel-root.Mui-focused': { color: palette.gold[400] },
  '& input::placeholder': { color: 'rgba(255,255,255,0.35)', opacity: 1 },
};

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: '', senha: '' });
  const [showPassword, setShowPassword] = useState(false);

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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${palette.navy[900]} 0%, ${palette.navy[950]} 40%, #0c0a1d 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle at 30% 50%, ${palette.navy[800]}22 0%, transparent 50%),
                       radial-gradient(circle at 70% 80%, ${palette.gold[500]}0a 0%, transparent 40%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          className="animate-in"
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 6,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
        >
          <Stack spacing={4} alignItems="center">
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${palette.gold[400]}, ${palette.gold[500]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: `0 8px 32px ${palette.gold[500]}33`,
                }}
              >
                <SchoolIcon sx={{ fontSize: 36, color: palette.navy[900] }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  mb: 0.5,
                }}
              >
                Persistema
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                Painel administrativo da escola
              </Typography>
            </Box>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Usuario"
                  name="usuario"
                  value={form.usuario}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlinedIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
                <TextField
                  fullWidth
                  label="Senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={form.senha}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          size="small"
                          sx={{ color: 'rgba(255,255,255,0.5)' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1rem',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${palette.gold[400]} 0%, ${palette.gold[500]} 100%)`,
                    color: palette.navy[900],
                    boxShadow: `0 8px 32px ${palette.gold[500]}33`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${palette.gold[400]} 0%, ${palette.gold[600]} 100%)`,
                      boxShadow: `0 12px 40px ${palette.gold[500]}44`,
                    },
                  }}
                >
                  Entrar
                </Button>
              </Stack>
            </form>

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
              Credenciais: qualquer usuario e senha
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
