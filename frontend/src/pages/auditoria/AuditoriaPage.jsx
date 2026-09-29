import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Grid, MenuItem, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography, Paper, Chip,
} from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

function AuditoriaPage() {
  const [eventos, setEventos] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [filtros, setFiltros] = useState({ busca: '', operacao: '', inicio: '', fim: '' });

  const carregar = async () => {
    const params = new URLSearchParams();
    if (filtros.busca) params.append('usuario', filtros.busca);
    if (filtros.operacao) params.append('operacao', filtros.operacao);
    if (filtros.inicio) params.append('inicio', filtros.inicio);
    if (filtros.fim) params.append('fim', filtros.fim);
    const q = params.toString();
    const [lista, res] = await Promise.all([
      api.get(`/auditoria${q ? `?${q}` : ''}`),
      api.get('/auditoria/resumo'),
    ]);
    setEventos(lista);
    setResumo(res);
  };

  useEffect(() => { carregar(); }, []);

  return (
    <Box>
      <PageHeader titulo="Auditoria" descricao="Rastreamento de logins e alteracoes — acesso restrito ao admin" />
      {resumo && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}><Card><CardContent><Typography variant="caption">Total de eventos</Typography><Typography variant="h5">{resumo.total}</Typography></CardContent></Card></Grid>
          <Grid item xs={6} md={3}><Card><CardContent><Typography variant="caption">Logins recusados (24h)</Typography><Typography variant="h5">{resumo.recusados24h}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} md={6}><Card><CardContent><Typography variant="caption">Por operacao</Typography><Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>{Object.entries(resumo.porOperacao).map(([k, v]) => <Chip key={k} label={`${k}: ${v}`} size="small" />)}</Stack></CardContent></Card></Grid>
        </Grid>
      )}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Buscar por usuario" value={filtros.busca}
                onChange={(e) => setFiltros((p) => ({ ...p, busca: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && carregar()} />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField select fullWidth label="Operacao" value={filtros.operacao}
                onChange={(e) => setFiltros((p) => ({ ...p, operacao: e.target.value }))}>
                <MenuItem value="">Todas</MenuItem>
                {['LOGIN_OK', 'LOGIN_FALHA', 'ALUNO_CRIADO', 'TURMA_CRIADA', 'ALUNO_VINCULADO', 'USUARIO_CRIADO', 'NOTA_CRIADA', 'NOTA_EXCLUIDA', 'FREQUENCIA_CRIADA', 'FREQUENCIA_EXCLUIDA', 'CHAMADA_SALVA'].map((o) => (
                  <MenuItem key={o} value={o}>{o}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField fullWidth type="date" label="Inicio" value={filtros.inicio} InputLabelProps={{ shrink: true }}
                onChange={(e) => setFiltros((p) => ({ ...p, inicio: e.target.value }))} />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField fullWidth type="date" label="Fim" value={filtros.fim} InputLabelProps={{ shrink: true }}
                onChange={(e) => setFiltros((p) => ({ ...p, fim: e.target.value }))} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {eventos.length === 0 ? (
        <EmptyState titulo="Nenhum registro" descricao="Nenhum evento de auditoria encontrado para os filtros." />
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Data/Hora</TableCell><TableCell>Usuario</TableCell><TableCell>Perfil</TableCell>
                <TableCell>Operacao</TableCell><TableCell>Recurso</TableCell><TableCell>Detalhes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventos.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{new Date(e.criado_em).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{e.usuario_nome || '—'}</TableCell>
                  <TableCell>{e.perfil || '—'}</TableCell>
                  <TableCell><Chip label={e.operacao} size="small" color={e.operacao.includes('FALHA') ? 'error' : 'default'} /></TableCell>
                  <TableCell>{e.recurso}{e.recurso_id ? ` #${e.recurso_id}` : ''}</TableCell>
                  <TableCell sx={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.detalhes || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default AuditoriaPage;
