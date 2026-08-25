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
  LinearProgress,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useAlunos } from '../../hooks/useAlunos';
import { useTurmas } from '../../hooks/useTurmas';
import { useFrequencias } from '../../hooks/useFrequencias';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import AlertMessage from '../../components/common/AlertMessage';
import { palette } from '../../theme';

const initialForm = {
  aluno_id: '',
  data_aula: '',
  presente: '',
};

const classificacaoConfig = {
  Boa: { color: palette.emerald[500], bg: '#ecfdf5', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
  Atencao: { color: palette.gold[600], bg: '#fffbeb', icon: <WarningAmberIcon sx={{ fontSize: 16 }} /> },
  Risco: { color: palette.rose[500], bg: '#fef2f2', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
};

function ClassificacaoChip({ classificacao }) {
  const config = classificacaoConfig[classificacao] || classificacaoConfig.Risco;
  return (
    <Chip
      icon={config.icon}
      label={classificacao}
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

function PercentualDisplay({ percentual }) {
  const config = percentual >= 75
    ? { color: palette.emerald[500], bg: '#ecfdf5' }
    : percentual >= 50
      ? { color: palette.gold[600], bg: '#fffbeb' }
      : { color: palette.rose[500], bg: '#fef2f2' };

  return (
    <Avatar
      sx={{
        width: 48,
        height: 48,
        fontSize: '0.85rem',
        fontWeight: 800,
        background: `linear-gradient(135deg, ${config.bg}, ${config.color}15)`,
        color: config.color,
        border: `2px solid ${config.color}20`,
      }}
    >
      {percentual.toFixed(0)}%
    </Avatar>
  );
}

function FrequenciaPage() {
  const { alunos } = useAlunos();
  const { turmas } = useTurmas();
  const { frequencias, cadastrar, excluir, buscarStats, buscarRanking, buscarEmRisco, recarregar } = useFrequencias();

  const [form, setForm] = useState(initialForm);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('success');
  const [salvando, setSalvando] = useState(false);

  const [alunoStatsId, setAlunoStatsId] = useState('');
  const [stats, setStats] = useState(null);
  const [carregandoStats, setCarregandoStats] = useState(false);

  const [turmaRankingId, setTurmaRankingId] = useState('');
  const [ranking, setRanking] = useState(null);
  const [carregandoRanking, setCarregandoRanking] = useState(false);

  const [emRisco, setEmRisco] = useState(null);
  const [carregandoRisco, setCarregandoRisco] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSalvando(true);
      await cadastrar({
        aluno_id: form.aluno_id,
        data_aula: form.data_aula,
        presente: form.presente === 'true',
      });
      setMensagem('Frequencia registrada com sucesso!');
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
      setMensagem('Registro excluido com sucesso!');
      setTipoMensagem('success');
    } catch (error) {
      setMensagem(error.message);
      setTipoMensagem('error');
    }
  };

  const handleBuscarStats = async () => {
    if (!alunoStatsId) {
      setMensagem('Selecione um aluno para ver as estatisticas.');
      setTipoMensagem('warning');
      return;
    }
    try {
      setCarregandoStats(true);
      const data = await buscarStats(alunoStatsId);
      setStats(data);
    } catch (error) {
      setMensagem(error.message);
      setTipoMensagem('error');
      setStats(null);
    } finally {
      setCarregandoStats(false);
    }
  };

  const handleBuscarRanking = async () => {
    if (!turmaRankingId) {
      setMensagem('Selecione uma turma para ver o ranking.');
      setTipoMensagem('warning');
      return;
    }
    try {
      setCarregandoRanking(true);
      const data = await buscarRanking(turmaRankingId);
      setRanking(data);
    } catch (error) {
      setMensagem(error.message);
      setTipoMensagem('error');
      setRanking(null);
    } finally {
      setCarregandoRanking(false);
    }
  };

  const handleBuscarRisco = async () => {
    try {
      setCarregandoRisco(true);
      const data = await buscarEmRisco();
      setEmRisco(data);
    } catch (error) {
      setMensagem(error.message);
      setTipoMensagem('error');
      setEmRisco(null);
    } finally {
      setCarregandoRisco(false);
    }
  };

  const frequenciasComAluno = frequencias.map((f) => ({
    ...f,
    nomeAluno: f.aluno?.nome || `Aluno #${f.aluno_id}`,
    turmaAluno: f.aluno?.turma?.nome || '-',
  }));

  return (
    <Box>
      <PageHeader titulo="Controle de Frequencia" descricao="Registre presencas e acompanhe a frequencia dos alunos." />

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
                    background: `linear-gradient(135deg, ${palette.emerald[500]}, ${palette.emerald[600]})`,
                  }}
                >
                  <EventAvailableIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Registrar Chamada
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={5}>
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
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Data da aula"
                      name="data_aula"
                      type="date"
                      value={form.data_aula}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      select
                      fullWidth
                      label="Presenca"
                      name="presente"
                      value={form.presente}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="true">Presente</MenuItem>
                      <MenuItem value="false">Ausente</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3.5 }}>
                  <Button type="submit" variant="contained" size="large" disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Registrar'}
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
              Registros de frequencia
            </Typography>
            <Chip
              label={frequencias.length}
              size="small"
              sx={{
                fontWeight: 600,
                backgroundColor: `${palette.emerald[500]}15`,
                color: palette.emerald[600],
              }}
            />
          </Box>

          {frequencias.length === 0 ? (
            <EmptyState titulo="Nenhum registro de frequencia" descricao="Preencha o formulario acima para registrar a primeira chamada." />
          ) : (
            <Card className="animate-in stagger-1">
              <TableContainer sx={{ borderRadius: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Aluno</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Turma</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Data</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }} align="right">Acao</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {frequenciasComAluno.map((freq) => (
                      <TableRow key={freq.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{freq.nomeAluno}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">{freq.turmaAluno}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(freq.data_aula + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {freq.presente ? (
                            <Chip
                              icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                              label="Presente"
                              size="small"
                              sx={{
                                fontWeight: 600,
                                backgroundColor: '#ecfdf5',
                                color: palette.emerald[600],
                              }}
                            />
                          ) : (
                            <Chip
                              icon={<CancelIcon sx={{ fontSize: 14 }} />}
                              label="Ausente"
                              size="small"
                              sx={{
                                fontWeight: 600,
                                backgroundColor: '#fef2f2',
                                color: palette.rose[500],
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Excluir">
                            <IconButton
                              size="small"
                              onClick={() => handleExcluir(freq.id)}
                              sx={{ color: 'grey.400', '&:hover': { color: 'error.main' } }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={3}>
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
                  background: `linear-gradient(135deg, ${palette.emerald[500]}, ${palette.emerald[600]})`,
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: `linear-gradient(135deg, ${palette.emerald[500]}, ${palette.emerald[600]})`,
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Estatisticas do Aluno
                  </Typography>
                </Box>

                <TextField
                  select
                  fullWidth
                  label="Selecione o aluno"
                  value={alunoStatsId}
                  onChange={(e) => setAlunoStatsId(e.target.value)}
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
                  onClick={handleBuscarStats}
                  disabled={!alunoStatsId || carregandoStats}
                  sx={{ mb: 3 }}
                >
                  {carregandoStats ? 'Carregando...' : 'Consultar Estatisticas'}
                </Button>

                {carregandoStats && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

                {stats && (
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
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {stats.aluno.nome}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        {stats.aluno.turma}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 3, mt: 2.5 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                            Frequencia
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            {stats.percentual.toFixed(0)}%
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                            Situacao
                          </Typography>
                          <ClassificacaoChip classificacao={stats.classificacao} />
                        </Box>
                      </Box>
                    </Box>

                    {stats.percentual < 75 && (
                      <Alert
                        severity="warning"
                        sx={{
                          mb: 3,
                          borderRadius: 2,
                          fontWeight: 500,
                          '& .MuiAlert-message': { width: '100%' },
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          Aluno com frequencia abaixo de 75%!
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Risco de reprovação por falta. {stats.faltas} falta(s) registrada(s).
                        </Typography>
                      </Alert>
                    )}

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5, mb: 3 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#fafafa', textAlign: 'center' }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: palette.emerald[500], mb: 0.5 }} />
                        <Typography variant="caption" color="text.secondary" display="block">
                          Presencas
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {stats.presencas}
                        </Typography>
                      </Box>
                      <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#fafafa', textAlign: 'center' }}>
                        <CancelIcon sx={{ fontSize: 20, color: palette.rose[500], mb: 0.5 }} />
                        <Typography variant="caption" color="text.secondary" display="block">
                          Faltas
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {stats.faltas}
                        </Typography>
                      </Box>
                      <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#fafafa', textAlign: 'center' }}>
                        <CalendarMonthIcon sx={{ fontSize: 20, color: palette.navy[500], mb: 0.5 }} />
                        <Typography variant="caption" color="text.secondary" display="block">
                          Total Aulas
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {stats.totalAulas}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Progresso</Typography>
                        <Typography variant="caption" fontWeight={600}>{stats.percentual.toFixed(0)}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={stats.percentual}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: '#f1f5f9',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            background: stats.percentual >= 75
                              ? `linear-gradient(90deg, ${palette.emerald[400]}, ${palette.emerald[500]})`
                              : stats.percentual >= 50
                                ? `linear-gradient(90deg, ${palette.gold[400]}, ${palette.gold[500]})`
                                : `linear-gradient(90deg, ${palette.rose[400]}, ${palette.rose[500]})`,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card className="animate-in stagger-3" sx={{ overflow: 'visible' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: `linear-gradient(135deg, #7c3aed, #6d28d9)`,
                    }}
                  >
                    <EmojiEventsIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Ranking da Turma
                  </Typography>
                </Box>

                <TextField
                  select
                  fullWidth
                  label="Selecione a turma"
                  value={turmaRankingId}
                  onChange={(e) => setTurmaRankingId(e.target.value)}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  {turmas.map((turma) => (
                    <MenuItem key={turma.id} value={turma.id}>
                      {turma.nome}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleBuscarRanking}
                  disabled={!turmaRankingId || carregandoRanking}
                  sx={{ mb: 3 }}
                >
                  {carregandoRanking ? 'Carregando...' : 'Ver Ranking'}
                </Button>

                {carregandoRanking && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

                {ranking && (
                  <Box className="animate-in">
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                      Turma: {ranking.turma}
                    </Typography>
                    {ranking.ranking.length > 0 ? (
                      <Stack spacing={1}>
                        {ranking.ranking.map((item, index) => (
                          <Box
                            key={item.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: index === 0 ? '#ecfdf5' : '#fafafa',
                              border: '1px solid',
                              borderColor: index === 0 ? `${palette.emerald[200]}` : 'divider',
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                color: index === 0 ? palette.emerald[600] : 'text.secondary',
                                minWidth: 20,
                              }}
                            >
                              #{index + 1}
                            </Typography>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="body2" fontWeight={600} noWrap>
                                {item.nome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.presencas}/{item.totalAulas} aulas
                              </Typography>
                            </Box>
                            <PercentualDisplay percentual={item.percentual} />
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2, fontStyle: 'italic' }}>
                        Nenhum registro de frequencia nesta turma.
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card className="animate-in stagger-4" sx={{ overflow: 'visible' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: `linear-gradient(135deg, ${palette.rose[400]}, ${palette.rose[500]})`,
                    }}
                  >
                    <WarningAmberIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Alunos em Risco
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleBuscarRisco}
                  disabled={carregandoRisco}
                  sx={{ mb: 2 }}
                >
                  {carregandoRisco ? 'Carregando...' : 'Verificar Alunos Abaixo de 75%'}
                </Button>

                {carregandoRisco && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

                {emRisco !== null && (
                  <Box className="animate-in">
                    {emRisco.length > 0 ? (
                      <Stack spacing={1}>
                        {emRisco.map((item) => (
                          <Box
                            key={item.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: '#fef2f2',
                              border: '1px solid',
                              borderColor: `${palette.rose[200]}`,
                            }}
                          >
                            <PercentualDisplay percentual={item.percentual} />
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="body2" fontWeight={600} noWrap>
                                {item.nome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.turma} | {item.faltas} falta(s)
                              </Typography>
                            </Box>
                            <ClassificacaoChip classificacao={item.classificacao} />
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Alert severity="success" sx={{ borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight={500}>
                          Todos os alunos estao com frequencia acima de 75%!
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FrequenciaPage;
