import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SellerLogin.css'; // Mismo archivo CSS que Login

function SellerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch('http://localhost/back-ropa/seller-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        localStorage.setItem('id_vendedor', data.id_vendedor);
        localStorage.setItem('nombre_vendedor', data.nombre_vendedor);
        localStorage.setItem('correo', data.correo);
        
        navigate('/dashboard'); // Redirige al dashboard del vendedor
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
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
          <h1 id="inicio">Iniciar Sesión (Vendedor)</h1>
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
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="login-links">
          <Link to="/seller-register">¿No tienes cuenta? Regístrate</Link>
          <Link to="/login">¿Eres cliente? Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
}

export default SellerLogin;