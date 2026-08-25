import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAlunos } from '../../hooks/useAlunos';
import { useTurmas } from '../../hooks/useTurmas';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import AlertMessage from '../../components/common/AlertMessage';
import { palette } from '../../theme';

const initialForm = {
  nome: '',
  email: '',
  data_nascimento: '',
  serie: '',
  turma_id: '',
  cpf: '',
  telefone: '',
  endereco: '',
};

function AlunosPage() {
  const { alunos, cadastrar, recarregar } = useAlunos();
  const { turmas } = useTurmas();
  const [form, setForm] = useState(initialForm);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('success');
  const [salvando, setSalvando] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSalvando(true);
      const payload = { ...form };
      if (payload.turma_id) {
        delete payload.serie;
      } else {
        delete payload.turma_id;
      }
      await cadastrar(payload);
      setMensagem('Aluno cadastrado com sucesso!');
      setTipoMensagem('success');
      setForm(initialForm);
      recarregar();
    } catch (error) {
      setMensagem(error.message);
      setTipoMensagem('error');
    } finally {
      setSalvando(false);
    }
  };

  const turmaSelecionada = turmas.find((t) => String(t.id) === String(form.turma_id));

  return (
    <Box>
      <PageHeader titulo="Cadastro de Alunos" descricao="Cadastre e consulte estudantes." />

      <AlertMessage mensagem={mensagem} tipo={tipoMensagem} onClose={() => setMensagem('')} />

      <Card className="animate-in" sx={{ mb: 4 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${palette.navy[500]}, ${palette.navy[600]})`,
              }}
            >
              <PersonAddIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Novo Aluno
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome completo"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de nascimento"
                  name="data_nascimento"
                  type="date"
                  value={form.data_nascimento}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Turma"
                  name="turma_id"
                  value={form.turma_id || ''}
                  onChange={handleChange}
                  helperText={turmas.length ? 'Selecione uma turma ou preencha a serie abaixo.' : 'Nenhuma turma cadastrada.'}
                >
                  <MenuItem value="">Sem turma</MenuItem>
                  {turmas.map((turma) => (
                    <MenuItem key={turma.id} value={turma.id}>
                      {turma.nome} - {turma.serie} ({turma.ano})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Serie"
                  name="serie"
                  value={turmaSelecionada ? turmaSelecionada.serie : form.serie}
                  onChange={handleChange}
                  disabled={Boolean(turmaSelecionada)}
                  required={!turmaSelecionada}
                  helperText={turmaSelecionada ? 'Preenchida automaticamente pela turma.' : ''}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="CPF" name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Endereco" name="endereco" value={form.endereco} onChange={handleChange} />
              </Grid>
            </Grid>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3.5 }}>
              <Button type="submit" variant="contained" size="large" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar aluno'}
              </Button>
              <Button variant="outlined" size="large" onClick={() => setForm(initialForm)}>
                Limpar
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Alunos cadastrados
        </Typography>
        <Chip
          label={alunos.length}
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: palette.navy[50],
            color: palette.navy[700],
          }}
        />
      </Box>

      {alunos.length === 0 ? (
        <EmptyState titulo="Nenhum aluno cadastrado" descricao="Preencha o formulario acima para cadastrar o primeiro aluno." />
      ) : (
        <Stack spacing={1.5}>
          {alunos.map((aluno, index) => (
            <Card
              key={aluno.id}
              variant="outlined"
              className={`animate-in stagger-${Math.min(index + 1, 4)}`}
              sx={{
                '&:hover': { borderColor: palette.navy[200] },
              }}
            >
              <CardContent sx={{ py: 2, px: 2.5, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      background: `linear-gradient(135deg, ${palette.navy[100]}, ${palette.navy[200]})`,
                      color: palette.navy[700],
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    {aluno.nome.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography fontWeight={600} sx={{ lineHeight: 1.3 }}>
                      {aluno.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {aluno.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={aluno.serie}
                      size="small"
                      sx={{ fontWeight: 500, backgroundColor: '#f1f5f9', fontSize: '0.75rem' }}
                    />
                    {aluno.turma ? (
                      <Chip
                        label={aluno.turma.nome}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          background: `linear-gradient(135deg, ${palette.navy[50]}, ${palette.navy[100]})`,
                          color: palette.navy[700],
                          fontSize: '0.75rem',
                        }}
                      />
                    ) : (
                      <Chip label="Sem turma" size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default AlunosPage;
