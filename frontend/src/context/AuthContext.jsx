import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('usuario')) || null;
    } catch {
      return null;
    }
  });
  const [erroLogin, setErroLogin] = useState(null);
  const [carregandoLogin, setCarregandoLogin] = useState(false);

  const login = useCallback(async (email, senha) => {
    setCarregandoLogin(true);
    setErroLogin(null);
    try {
      const data = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      setUsuario(data.usuario);
      return true;
    } catch (error) {
      setErroLogin(error.message);
      return false;
    } finally {
      setCarregandoLogin(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn: !!usuario, usuario, login, logout, erroLogin, carregandoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return context;
}
