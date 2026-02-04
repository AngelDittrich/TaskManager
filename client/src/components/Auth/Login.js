import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register } from '../../services/api';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
        // Auto login after register or ask user to login?
        // Let's auto login for better UX
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    // Clear fields if desired, or keep them for user convenience
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isLogin ? 'Bienvenido' : 'Crear Cuenta'}</h1>
        <p className="subtitle">
          {isLogin ? 'Iniciá sesión para continuar' : 'Registrate para empezar a gestionar tareas'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group animate-fade-in">
              <label>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
                placeholder="Tu nombre de usuario"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button type="button" onClick={toggleMode} className="auth-link">
            {isLogin ? "Crear una" : "Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
