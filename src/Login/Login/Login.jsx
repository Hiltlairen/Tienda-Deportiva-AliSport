import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../conexion/estado'; // Asegúrate que la ruta sea correcta
import './Login.css';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await authService.login(correo, password);
    if (result.success) {
      // Redirigir según el rol
      window.location.href = result.rol === 'vendedor' ? '/dashboard' : '/';
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">Ingresar</button>

        <div className="register-links">
          <span>¿No tienes cuenta? </span>
          <Link to="/register?type=cliente">Regístrate como Cliente</Link>
          <span> o </span>
          <Link to="/register?type=vendedor">Regístrate como Vendedor</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;