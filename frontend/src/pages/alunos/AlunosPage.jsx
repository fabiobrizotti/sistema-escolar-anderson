import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAlunos } from '../../hooks/useAlunos';
import { useTurmas } from '../../hooks/useTurmas';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import AlertMessage from '../../components/common/AlertMessage';

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
  const { turmas, carregando: turmasCarregando } = useTurmas();
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

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Nome" name="nome" value={form.nome} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Data de nascimento" name="data_nascimento" type="date" value={form.data_nascimento} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Turma"
                  name="turma_id"
                  value={form.turma_id || ''}
                  onChange={handleChange}
                  helperText={turmas.length ? 'Selecione uma turma ou preencha a serie abaixo.' : 'Nenhuma turma cadastrada. Preencha a serie manualmente.'}
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
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

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Alunos cadastrados
      </Typography>
      {alunos.length === 0 ? (
        <EmptyState titulo="Nenhum aluno cadastrado" descricao="Preencha o formulario acima para cadastrar o primeiro aluno." />
      ) : (
        <Stack spacing={1}>
          {alunos.map((aluno) => (
            <Card key={aluno.id} variant="outlined">
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography fontWeight={600}>{aluno.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {aluno.email} | {aluno.serie} | {aluno.turma ? `Turma: ${aluno.turma.nome}` : 'Sem turma'}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default AlunosPage;
