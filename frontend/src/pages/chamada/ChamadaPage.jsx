import { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Checkbox, Grid, MenuItem, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Paper,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useTurmas } from '../../hooks/useTurmas';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import AlertMessage from '../../components/common/AlertMessage';
import api from '../../services/api';

const hoje = new Date().toISOString().slice(0, 10);

function ChamadaPage() {
  const { turmas } = useTurmas();
  const { usuario } = useAuth();
  const [cabecalho, setCabecalho] = useState({
    turma_id: '', disciplina: usuario?.disciplina || '', data_aula: hoje, quantidade_aulas: 2, plano_aula: '',
  });
  const [alunos, setAlunos] = useState([]);
  const [faltas, setFaltas] = useState({});
  const [mensagem, setMensagem] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setCabecalho((p) => ({ ...p, disciplina: p.disciplina || usuario?.disciplina || '' }));
  }, [usuario]);

  useEffect(() => {
    if (!cabecalho.turma_id) {
      setAlunos([]);
      return;
    }
    api.get(`/turmas/${cabecalho.turma_id}/alunos`)
      .then((t) => setAlunos(t.alunos || []))
      .catch(() => setAlunos([]));
  }, [cabecalho.turma_id]);

  const alternarFalta = (alunoId, aula) => {
    setFaltas((prev) => {
      const atual = new Set(prev[alunoId] || []);
      if (atual.has(aula)) atual.delete(aula);
      else atual.add(aula);
      return { ...prev, [alunoId]: [...atual] };
    });
  };

  const salvar = async () => {
    setSalvando(true);
    setMensagem(null);
    try {
      const payload = {
        turma_id: Number(cabecalho.turma_id),
        data_aula: cabecalho.data_aula,
        disciplina: cabecalho.disciplina,
        quantidade_aulas: Number(cabecalho.quantidade_aulas),
        plano_aula: cabecalho.plano_aula || null,
        faltas: alunos.map((a) => ({ aluno_id: a.id, aulas: faltas[a.id] || [] })),
      };
      const r = await api.post('/frequencias/chamada', payload);
      setMensagem({ tipo: 'success', texto: `Chamada salva: ${r.alunos} alunos, ${r.registros} registros.` });
      setFaltas({});
    } catch (error) {
      setMensagem({ tipo: 'error', texto: error.message });
    } finally {
      setSalvando(false);
    }
  };

  const aulas = Array.from({ length: Number(cabecalho.quantidade_aulas) || 0 }, (_, i) => i + 1);

  return (
    <Box>
      <PageHeader titulo="Fazer Chamada" descricao={usuario?.disciplina ? `Disciplina: ${usuario.disciplina}` : 'Chamada por aula — marque a falta em cada aula'} />
      {mensagem && <AlertMessage tipo={mensagem.tipo} mensagem={mensagem.texto} onClose={() => setMensagem(null)} />}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Turma" value={cabecalho.turma_id}
                onChange={(e) => setCabecalho((p) => ({ ...p, turma_id: e.target.value }))}>
                {turmas.map((t) => <MenuItem key={t.id} value={t.id}>{t.nome} — {t.ano}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Disciplina" value={cabecalho.disciplina}
                disabled={usuario?.perfil === 'professor' && !!usuario?.disciplina}
                onChange={(e) => setCabecalho((p) => ({ ...p, disciplina: e.target.value }))} />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField fullWidth type="date" label="Data" value={cabecalho.data_aula}
                onChange={(e) => setCabecalho((p) => ({ ...p, data_aula: e.target.value }))} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField fullWidth type="number" label="Qtd. aulas" value={cabecalho.quantidade_aulas}
                inputProps={{ min: 1, max: 10 }}
                onChange={(e) => setCabecalho((p) => ({ ...p, quantidade_aulas: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField fullWidth label="Plano de aula" value={cabecalho.plano_aula}
                onChange={(e) => setCabecalho((p) => ({ ...p, plano_aula: e.target.value }))} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {alunos.length > 0 && (
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">{alunos.length} alunos</Typography>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={salvar} disabled={salvando || !cabecalho.disciplina}>
                {salvando ? 'Salvando...' : 'Salvar Chamada'}
              </Button>
            </Stack>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Aluno</TableCell>
                    {aulas.map((a) => <TableCell key={a} align="center">Aula {a} (falta?)</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alunos.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.nome}</TableCell>
                      {aulas.map((n) => (
                        <TableCell key={n} align="center">
                          <Checkbox
                            checked={(faltas[a.id] || []).includes(n)}
                            onChange={() => alternarFalta(a.id, n)}
                            color="error"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default ChamadaPage;
