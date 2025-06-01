import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/back';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser({ 
        correo: email, 
        password 
      });

      if (data.success) {
        sessionStorage.setItem('id_usuario', data.id_usuario);
        console.log("✅ ID de usuario guardado en memoria:", data.id_usuario);

        // Redirigir según el rol
        navigate(data.rol === 'vendedor' ? '/dashboard' : '/');
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('❌ Error en la solicitud:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo de AliSport" className="login-logo" />
          <h1 id="inicio">Iniciar Sesión</h1>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-links">
          <p className="register-prompt">
            ¿No tienes cuenta? <a href="/register" className="register-link">Regístrate aquí</a>
          </p>
          <a href="/recuperar-contrasena" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;