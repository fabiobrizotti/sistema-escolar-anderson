import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import AlunosPage from '../pages/alunos/AlunosPage';
import TurmasPage from '../pages/turmas/TurmasPage';
import NotasPage from '../pages/notas/NotasPage';
import FrequenciaPage from '../pages/frequencia/FrequenciaPage';
import ChamadaPage from '../pages/chamada/ChamadaPage';
import AuditoriaPage from '../pages/auditoria/AuditoriaPage';
import PortalAlunoPage from '../pages/portal/PortalAlunoPage';
import UsuariosPage from '../pages/usuarios/UsuariosPage';
import PlaceholderPage from '../pages/PlaceholderPage';

function RotaPorPerfil({ perfis, children }) {
  const { usuario } = useAuth();
  if (!perfis.includes(usuario?.perfil)) return <Navigate to="/" replace />;
  return children;
}

function RotasProtegidas() {
  const { usuario } = useAuth();

  if (usuario?.perfil === 'aluno') {
    return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PortalAlunoPage />} />
          <Route path="/portal" element={<PortalAlunoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/alunos" element={<AlunosPage />} />
        <Route path="/turmas" element={<TurmasPage />} />
        <Route path="/notas" element={<NotasPage />} />
        <Route path="/frequencia" element={<FrequenciaPage />} />
        <Route path="/chamada" element={<RotaPorPerfil perfis={['admin', 'professor']}><ChamadaPage /></RotaPorPerfil>} />
        <Route path="/auditoria" element={<RotaPorPerfil perfis={['admin']}><AuditoriaPage /></RotaPorPerfil>} />
        <Route path="/usuarios" element={<RotaPorPerfil perfis={['admin']}><UsuariosPage /></RotaPorPerfil>} />
        <Route path="/professores" element={<PlaceholderPage titulo="Professores" descricao="Gestao de professores estara disponivel em breve." />} />
        <Route path="/financeiro" element={<PlaceholderPage titulo="Financeiro" descricao="Mensalidades e contas estarao disponiveis em breve." />} />
        <Route path="/relatorios" element={<PlaceholderPage titulo="Relatorios" descricao="Indicadores da escola estarao disponiveis em breve." />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function AppRoutes() {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return <RotasProtegidas />;
}

export default AppRoutes;
