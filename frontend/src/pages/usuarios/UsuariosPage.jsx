import { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Grid, MenuItem, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper, Chip,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PageHeader from '../../components/common/PageHeader';
import AlertMessage from '../../components/common/AlertMessage';
import { useAlunos } from '../../hooks/useAlunos';
import api from '../../services/api';

function UsuariosPage() {
  const { alunos } = useAlunos();
  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'professor', disciplina: '', aluno_id: '' });

  const carregar = () => api.get('/usuarios').then(setUsuarios).catch(() => setUsuarios([]));
  useEffect(() => { carregar(); }, []);

  const criar = async (e) => {
    e.preventDefault();
    setMensagem(null);
    try {
      await api.post('/usuarios', {
        ...form,
        disciplina: form.disciplina || null,
        aluno_id: form.aluno_id ? Number(form.aluno_id) : null,
      });
      setMensagem({ tipo: 'success', texto: 'Conta criada com sucesso.' });
      setForm({ nome: '', email: '', senha: '', perfil: 'professor', disciplina: '', aluno_id: '' });
      carregar();
    } catch (error) {
      setMensagem({ tipo: 'error', texto: error.message });
    }
  };

  return (
    <Box>
      <PageHeader titulo="Usuarios e Acessos" descricao="Crie contas de professor, aluno e admin — senhas com hash, nunca em texto puro" />
      {mensagem && <AlertMessage tipo={mensagem.tipo} mensagem={mensagem.texto} onClose={() => setMensagem(null)} />}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Nova conta</Typography>
              <form onSubmit={criar}>
                <Stack spacing={2}>
                  <TextField label="Nome" value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} required fullWidth />
                  <TextField label="E-mail" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required fullWidth />
                  <TextField label="Senha" type="password" value={form.senha} onChange={(e) => setForm((p) => ({ ...p, senha: e.target.value }))} required fullWidth />
                  <TextField select label="Perfil" value={form.perfil} onChange={(e) => setForm((p) => ({ ...p, perfil: e.target.value }))} fullWidth>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="professor">Professor</MenuItem>
                    <MenuItem value="aluno">Aluno</MenuItem>
                  </TextField>
                  {form.perfil === 'professor' && (
                    <TextField label="Disciplina" value={form.disciplina} onChange={(e) => setForm((p) => ({ ...p, disciplina: e.target.value }))} fullWidth placeholder="Ex: Matematica" />
                  )}
                  {form.perfil === 'aluno' && (
                    <TextField select label="Aluno vinculado" value={form.aluno_id} onChange={(e) => setForm((p) => ({ ...p, aluno_id: e.target.value }))} fullWidth required>
                      {alunos.map((a) => <MenuItem key={a.id} value={a.id}>{a.nome}</MenuItem>)}
                    </TextField>
                  )}
                  <Button type="submit" variant="contained" startIcon={<PersonAddIcon />}>Criar conta</Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead><TableRow><TableCell>Nome</TableCell><TableCell>E-mail</TableCell><TableCell>Perfil</TableCell><TableCell>Disciplina/Aluno</TableCell></TableRow></TableHead>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.nome}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Chip label={u.perfil} size="small" /></TableCell>
                    <TableCell>{u.disciplina || (u.aluno_id ? `aluno #${u.aluno_id}` : '—')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UsuariosPage;
