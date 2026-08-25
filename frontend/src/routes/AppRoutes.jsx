import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import AlunosPage from '../pages/alunos/AlunosPage';
import TurmasPage from '../pages/turmas/TurmasPage';
import PlaceholderPage from '../pages/PlaceholderPage';

function RotasProtegidas() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/alunos" element={<AlunosPage />} />
        <Route path="/turmas" element={<TurmasPage />} />
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
