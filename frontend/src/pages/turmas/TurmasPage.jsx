import { useState } from 'react';
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
import { useTurmas } from '../../hooks/useTurmas';
import { useAlunos } from '../../hooks/useAlunos';
import { useVincular } from '../../hooks/useVincular';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import AlertMessage from '../../components/common/AlertMessage';

const initialTurmaForm = {
  nome: '',
  serie: '',
  ano: String(new Date().getFullYear()),
};

function TurmasPage() {
  const { turmas, cadastrar, recarregar: recarregarTurmas } = useTurmas();
  const { alunosSemTurma, recarregar: recarregarAlunos } = useAlunos();
  const { vincular, vinculando } = useVincular();

  const [turmaForm, setTurmaForm] = useState(initialTurmaForm);
  const [alunosSelecionados, setAlunosSelecionados] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('success');
  const [salvando, setSalvando] = useState(false);

  const handleTurmaChange = (event) => {
    const { name, value } = event.target;
    setTurmaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTurmaSubmit = async (event) => {
    event.preventDefault();
    try {
      setSalvando(true);
      await cadastrar(turmaForm);
      setMensagem('Turma cadastrada com sucesso!');
      setTipoMensagem('success');
      setTurmaForm(initialTurmaForm);
    } catch (error) {
      setMensagem(error.message);
      setTipoMensagem('error');
    } finally {
      setSalvando(false);
    }
  };

  const handleVincular = async (turmaId) => {
    const alunoId = alunosSelecionados[turmaId];
    if (!alunoId) {
      setMensagem('Escolha um aluno antes de vincular.');
      setTipoMensagem('warning');
      return;
    }

    try {
      await vincular(turmaId, alunoId);
      setMensagem('Aluno vinculado a turma com sucesso!');
      setTipoMensagem('success');
      setAlunosSelecionados((prev) => ({ ...prev, [turmaId]: '' }));
      recarregarTurmas();
      recarregarAlunos();
    } catch (error) {
      setMensagem(error.message);
      setTipoMensagem('error');
    }
  };

  return (
    <Box>
      <PageHeader titulo="Gestao de Turmas" descricao="Cadastre turmas e vincule alunos." />

      <AlertMessage mensagem={mensagem} tipo={tipoMensagem} onClose={() => setMensagem('')} />

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Cadastro de Turma
          </Typography>
          <form onSubmit={handleTurmaSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Nome da turma" name="nome" value={turmaForm.nome} onChange={handleTurmaChange} placeholder="Ex.: 3o DS" required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Serie" name="serie" value={turmaForm.serie} onChange={handleTurmaChange} placeholder="Ex.: 3o Ano" required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Ano letivo" name="ano" value={turmaForm.ano} onChange={handleTurmaChange} type="number" inputProps={{ min: 2020, max: 2100 }} required />
              </Grid>
            </Grid>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" size="large" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar turma'}
              </Button>
              <Button variant="outlined" size="large" onClick={() => setTurmaForm(initialTurmaForm)}>
                Limpar
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Turmas cadastradas
      </Typography>
      {turmas.length === 0 ? (
        <EmptyState titulo="Nenhuma turma cadastrada" descricao="Preencha o formulario acima para cadastrar a primeira turma." />
      ) : (
        <Grid container spacing={2}>
          {turmas.map((turma) => (
            <Grid item xs={12} md={6} key={turma.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>{turma.nome}</Typography>
                  <Typography color="text.secondary">
                    {turma.serie} | Ano letivo {turma.ano}
                  </Typography>
                  <Typography sx={{ mt: 1.5 }} fontWeight={600}>
                    {turma.alunos?.length || 0} aluno(s) cadastrado(s)
                  </Typography>

                  <Stack spacing={1} sx={{ my: 2 }}>
                    {turma.alunos?.length ? (
                      turma.alunos.map((aluno) => (
                        <Box key={aluno.id} sx={{ p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight={600}>{aluno.nome}</Typography>
                          <Typography variant="caption" color="text.secondary">{aluno.email}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">Ainda nao ha alunos nesta turma.</Typography>
                    )}
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      label="Aluno para vincular"
                      value={alunosSelecionados[turma.id] || ''}
                      onChange={(event) => setAlunosSelecionados((prev) => ({
                        ...prev,
                        [turma.id]: event.target.value,
                      }))}
                      disabled={alunosSemTurma.length === 0}
                    >
                      {alunosSemTurma.map((aluno) => (
                        <MenuItem key={aluno.id} value={aluno.id}>
                          {aluno.nome}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      variant="outlined"
                      disabled={alunosSemTurma.length === 0 || vinculando}
                      onClick={() => handleVincular(turma.id)}
                    >
                      {vinculando ? 'Vinculando...' : 'Vincular'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default TurmasPage;
