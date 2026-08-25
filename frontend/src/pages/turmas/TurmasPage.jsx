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
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import LinkIcon from '@mui/icons-material/Link';
import { useTurmas } from '../../hooks/useTurmas';
import { useAlunos } from '../../hooks/useAlunos';
import { useVincular } from '../../hooks/useVincular';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import AlertMessage from '../../components/common/AlertMessage';
import { palette } from '../../theme';

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

      <Card className="animate-in" sx={{ mb: 4 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, #7c3aed, #6d28d9)`,
              }}
            >
              <AddIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Nova Turma
            </Typography>
          </Box>

          <form onSubmit={handleTurmaSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Nome da turma"
                  name="nome"
                  value={turmaForm.nome}
                  onChange={handleTurmaChange}
                  placeholder="Ex.: 3o DS"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Serie"
                  name="serie"
                  value={turmaForm.serie}
                  onChange={handleTurmaChange}
                  placeholder="Ex.: 3o Ano"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Ano letivo"
                  name="ano"
                  value={turmaForm.ano}
                  onChange={handleTurmaChange}
                  type="number"
                  inputProps={{ min: 2020, max: 2100 }}
                  required
                />
              </Grid>
            </Grid>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3.5 }}>
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Turmas cadastradas
        </Typography>
        <Chip
          label={turmas.length}
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: '#f5f3ff',
            color: '#6d28d9',
          }}
        />
      </Box>

      {turmas.length === 0 ? (
        <EmptyState titulo="Nenhuma turma cadastrada" descricao="Preencha o formulario acima para cadastrar a primeira turma." />
      ) : (
        <Grid container spacing={2.5}>
          {turmas.map((turma, index) => (
            <Grid item xs={12} md={6} key={turma.id}>
              <Card
                className={`animate-in stagger-${Math.min(index + 1, 4)}`}
                sx={{
                  height: '100%',
                  overflow: 'visible',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    borderRadius: '20px 20px 0 0',
                    background: `linear-gradient(135deg, #7c3aed, #6d28d9)`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {turma.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {turma.serie} | Ano letivo {turma.ano}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<GroupIcon sx={{ fontSize: 16 }} />}
                      label={`${turma.alunos?.length || 0}`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        background: '#f5f3ff',
                        color: '#6d28d9',
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {turma.alunos?.length ? (
                    <Stack spacing={1} sx={{ mb: 2.5 }}>
                      {turma.alunos.map((aluno) => (
                        <Box
                          key={aluno.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.2,
                            borderRadius: 2,
                            backgroundColor: '#fafafa',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: `linear-gradient(135deg, ${palette.navy[100]}, ${palette.navy[200]})`,
                              color: palette.navy[700],
                            }}
                          >
                            {aluno.nome.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {aluno.nome}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {aluno.email}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 2, textAlign: 'center', fontStyle: 'italic' }}
                    >
                      Ainda nao ha alunos nesta turma.
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      label="Aluno para vincular"
                      value={alunosSelecionados[turma.id] || ''}
                      onChange={(event) =>
                        setAlunosSelecionados((prev) => ({
                          ...prev,
                          [turma.id]: event.target.value,
                        }))
                      }
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
                      startIcon={<LinkIcon />}
                      disabled={alunosSemTurma.length === 0 || vinculando}
                      onClick={() => handleVincular(turma.id)}
                      sx={{ whiteSpace: 'nowrap', minWidth: 120 }}
                    >
                      {vinculando ? 'Vinculando...' : 'Vincular'}
                    </Button>
                  </Box>
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
