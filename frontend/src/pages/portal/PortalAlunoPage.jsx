import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Grid, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Paper, Chip, LinearProgress,
} from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function PortalAlunoPage() {
  const { usuario } = useAuth();
  const [notas, setNotas] = useState([]);
  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    api.get('/aluno/notas').then(setNotas).catch(() => setNotas([]));
    api.get('/aluno/frequencia/resumo').then(setResumo).catch(() => setResumo(null));
  }, []);

  return (
    <Box>
      <PageHeader titulo={`Ola, ${usuario?.nome || 'Aluno'}`} descricao="Minhas notas e minha frequencia" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Minhas notas</Typography>
              {notas.length === 0 ? (
                <EmptyState titulo="Sem notas" descricao="Ainda nao ha notas lancadas para voce." compacto />
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead><TableRow><TableCell>Disciplina</TableCell><TableCell>Bimestre</TableCell><TableCell align="right">Nota</TableCell></TableRow></TableHead>
                    <TableBody>
                      {notas.map((n) => (
                        <TableRow key={n.id}>
                          <TableCell>{n.disciplina}</TableCell>
                          <TableCell>{n.bimestre}º</TableCell>
                          <TableCell align="right">{Number(n.nota).toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Minha frequencia</Typography>
              {!resumo ? (
                <EmptyState titulo="Sem registros" descricao="Ainda nao ha registros de frequencia para voce." compacto />
              ) : (
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1}>
                    <Chip label={`${resumo.presencas} presencas`} color="success" size="small" />
                    <Chip label={`${resumo.faltas} faltas`} color="error" size="small" />
                    <Chip label={resumo.situacao} size="small" />
                  </Stack>
                  <Typography variant="body2">{resumo.percentual}% de frequencia em {resumo.totalAulas} aulas</Typography>
                  <LinearProgress variant="determinate" value={resumo.percentual} sx={{ height: 10, borderRadius: 5 }} />
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PortalAlunoPage;
