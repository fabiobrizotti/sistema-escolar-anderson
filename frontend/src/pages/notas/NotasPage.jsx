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
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAlunos } from '../../hooks/useAlunos';
import { useNotas } from '../../hooks/useNotas';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import AlertMessage from '../../components/common/AlertMessage';
import { palette } from '../../theme';

const BIMESTRES = [
  { value: 1, label: '1o Bimestre' },
  { value: 2, label: '2o Bimestre' },
  { value: 3, label: '3o Bimestre' },
  { value: 4, label: '4o Bimestre' },
];

const initialForm = {
  aluno_id: '',
  disciplina: '',
  bimestre: '',
  nota: '',
};

const situacaoConfig = {
  Aprovado: { color: palette.emerald[500], bg: '#ecfdf5', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
  Recuperacao: { color: palette.gold[600], bg: '#fffbeb', icon: <WarningAmberIcon sx={{ fontSize: 16 }} /> },
  Reprovado: { color: palette.rose[500], bg: '#fef2f2', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
};

function NotaChip({ situacao }) {
  const config = situacaoConfig[situacao] || situacaoConfig.Reprovado;
  return (
    <Chip
      icon={config.icon}
      label={situacao}
      size="small"
      sx={{
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
        border: '1px solid',
        borderColor: `${config.color}22`,
      }}
    />
  );
}

function MediaDisplay({ media, size = 'medium' }) {
  const config = media >= 7
    ? { color: palette.emerald[500], bg: '#ecfdf5' }
    : media >= 5
      ? { color: palette.gold[600], bg: '#fffbeb' }
      : { color: palette.rose[500], bg: '#fef2f2' };

  const dims = size === 'large' ? { width: 64, height: 64, fontSize: '1.1rem' } : { width: 44, height: 44, fontSize: '0.85rem' };

  return (
    <Avatar
      sx={{
        ...dims,
        background: `linear-gradient(135deg, ${config.bg}, ${config.color}15)`,
        color: config.color,
        fontWeight: 800,
        border: `2px solid ${config.color}20`,
      }}
    >
      {media.toFixed(1)}
    </Avatar>
  );
}

function NotasPage() {
  const { alunos } = useAlunos();
  const { notas, cadastrar, excluir, buscarBoletim, recarregar } = useNotas();

  const [form, setForm] = useState(initialForm);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('success');
  const [salvando, setSalvando] = useState(false);

  const [alunoBoletimId, setAlunoBoletimId] = useState('');
  const [boletim, setBoletim] = useState(null);
  const [carregandoBoletim, setCarregandoBoletim] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSalvando(true);
      await cadastrar(form);
      setMensagem('Nota cadastrada com sucesso!');
      setTipoMensagem('success');
      setForm(initialForm);
    } catch (error) {
      setMensagem(error.message);
      setTipoMensagem('error');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (id) => {
    try {
      await excluir(id);
      setMensagem('Nota excluida com sucesso!');
      setTipoMensagem('success');
    } catch (error) {
      setMensagem(error.message);
      setTipoMensagem('error');
    }
  };

  const handleBuscarBoletim = async () => {
    if (!alunoBoletimId) {
      setMensagem('Selecione um aluno para consultar o boletim.');
      setTipoMensagem('warning');
      return;
    }
    try {
      setCarregandoBoletim(true);
      const data = await buscarBoletim(alunoBoletimId);
      setBoletim(data);
    } catch (error) {
      setMensagem(error.message);
      setTipoMensagem('error');
      setBoletim(null);
    } finally {
      setCarregandoBoletim(false);
    }
  };

  const notasAgrupadas = notas.reduce((acc, nota) => {
    const alunoId = nota.aluno_id;
    if (!acc[alunoId]) {
      acc[alunoId] = { aluno: nota.aluno, notas: [] };
    }
    acc[alunoId].notas.push(nota);
    return acc;
  }, {});

  return (
    <Box>
      <PageHeader titulo="Lancamento de Notas" descricao="Cadastre notas e consulte o boletim dos alunos." />

      <AlertMessage mensagem={mensagem} tipo={tipoMensagem} onClose={() => setMensagem('')} />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card className="animate-in" sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: `linear-gradient(135deg, ${palette.gold[400]}, ${palette.gold[500]})`,
                  }}
                >
                  <GradeIcon sx={{ fontSize: 20, color: palette.navy[900] }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Nova Nota
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Aluno"
                      name="aluno_id"
                      value={form.aluno_id}
                      onChange={handleChange}
                      required
                    >
                      {alunos.map((aluno) => (
                        <MenuItem key={aluno.id} value={aluno.id}>
                          {aluno.nome}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Disciplina"
                      name="disciplina"
                      value={form.disciplina}
                      onChange={handleChange}
                      placeholder="Ex.: Matematica"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Bimestre"
                      name="bimestre"
                      value={form.bimestre}
                      onChange={handleChange}
                      required
                    >
                      {BIMESTRES.map((b) => (
                        <MenuItem key={b.value} value={b.value}>
                          {b.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Nota"
                      name="nota"
                      type="number"
                      inputProps={{ min: 0, max: 10, step: 0.1 }}
                      value={form.nota}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3.5 }}>
                  <Button type="submit" variant="contained" size="large" disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Salvar nota'}
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
              Notas cadastradas
            </Typography>
            <Chip
              label={notas.length}
              size="small"
              sx={{
                fontWeight: 600,
                backgroundColor: `${palette.gold[400]}15`,
                color: palette.gold[600],
              }}
            />
          </Box>

          {notas.length === 0 ? (
            <EmptyState titulo="Nenhuma nota lancada" descricao="Preencha o formulario acima para lancar a primeira nota." />
          ) : (
            <Stack spacing={2}>
              {Object.entries(notasAgrupadas).map(([alunoId, { aluno, notas: notasAluno }], index) => (
                <Card
                  key={alunoId}
                  className={`animate-in stagger-${Math.min(index + 1, 4)}`}
                  sx={{ overflow: 'visible' }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: `linear-gradient(135deg, ${palette.navy[100]}, ${palette.navy[200]})`,
                          color: palette.navy[700],
                        }}
                      >
                        {aluno?.nome?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {aluno?.nome || `Aluno #${alunoId}`}
                      </Typography>
                    </Box>
                    <Stack spacing={1}>
                      {notasAluno.map((nota) => (
                        <Box
                          key={nota.id}
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
                          <MediaDisplay media={Number(nota.nota)} />
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {nota.disciplina}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {BIMESTRES.find((b) => b.value === nota.bimestre)?.label || `${nota.bimestre}o Bimestre`}
                            </Typography>
                          </Box>
                          <Tooltip title="Excluir">
                            <IconButton
                              size="small"
                              onClick={() => handleExcluir(nota.id)}
                              sx={{ color: 'grey.400', '&:hover': { color: 'error.main' } }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card
            className="animate-in stagger-2"
            sx={{
              position: 'sticky',
              top: 24,
              overflow: 'visible',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                borderRadius: '20px 20px 0 0',
                background: `linear-gradient(135deg, ${palette.gold[400]}, ${palette.gold[500]})`,
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: `linear-gradient(135deg, ${palette.navy[500]}, ${palette.navy[600]})`,
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Boletim do Aluno
                </Typography>
              </Box>

              <TextField
                select
                fullWidth
                label="Selecione o aluno"
                value={alunoBoletimId}
                onChange={(e) => setAlunoBoletimId(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
              >
                {alunos.map((aluno) => (
                  <MenuItem key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                fullWidth
                variant="contained"
                onClick={handleBuscarBoletim}
                disabled={!alunoBoletimId || carregandoBoletim}
                sx={{ mb: 3 }}
              >
                {carregandoBoletim ? 'Carregando...' : 'Consultar Boletim'}
              </Button>

              {carregandoBoletim && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

              {boletim && (
                <Box className="animate-in">
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${palette.navy[900]}, ${palette.navy[950]})`,
                      color: '#ffffff',
                      mb: 3,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
                      Aluno
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      {boletim.aluno.nome}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                          Media Geral
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                          {boletim.resumo.mediaGeral.toFixed(1)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                          Situacao
                        </Typography>
                        <NotaChip situacao={boletim.resumo.situacaoGeral} />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#fafafa', textAlign: 'center' }}>
                      <TrendingUpIcon sx={{ fontSize: 20, color: palette.emerald[500], mb: 0.5 }} />
                      <Typography variant="caption" color="text.secondary" display="block">
                        Maior Nota
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {boletim.resumo.maiorNotaGeral.toFixed(1)}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#fafafa', textAlign: 'center' }}>
                      <WarningAmberIcon sx={{ fontSize: 20, color: palette.gold[500], mb: 0.5 }} />
                      <Typography variant="caption" color="text.secondary" display="block">
                        Menor Nota
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {boletim.resumo.menorNotaGeral.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>

                  {boletim.boletim.length > 0 ? (
                    <Stack spacing={1.5}>
                      {boletim.boletim.map((disc) => (
                        <Box
                          key={disc.disciplina}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: '#ffffff',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {disc.disciplina}
                            </Typography>
                            <NotaChip situacao={disc.situacao} />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(disc.media / 10) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: '#f1f5f9',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    background: disc.media >= 7
                                      ? `linear-gradient(90deg, ${palette.emerald[400]}, ${palette.emerald[500]})`
                                      : disc.media >= 5
                                        ? `linear-gradient(90deg, ${palette.gold[400]}, ${palette.gold[500]})`
                                        : `linear-gradient(90deg, ${palette.rose[400]}, ${palette.rose[500]})`,
                                  },
                                }}
                              />
                            </Box>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ minWidth: 36, textAlign: 'right' }}>
                              {disc.media.toFixed(1)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            {disc.notas.map((n, i) => (
                              <Chip
                                key={i}
                                label={`${i + 1}B: ${n}`}
                                size="small"
                                sx={{ fontSize: '0.7rem', height: 22, fontWeight: 500 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3, fontStyle: 'italic' }}>
                      Nenhuma nota lancada para este aluno.
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NotasPage;
