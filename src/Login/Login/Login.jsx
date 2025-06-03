import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../conexion/estado';
import './Login.css';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authService.login(correo, password);
      
      if (result.success) {
        // Redirigir según el rol
        window.location.href = result.rol === 'vendedor' ? '/dashboard' : '/';
      } else if (result.needsVerification) {
        setNeedsVerification(true);
        setError('Por favor verifica tu correo electrónico');
      } else {
        setError(result.message || 'Error en la autenticación');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.verifyEmail(correo, verificationCode);
      
      if (result.success) {
        // Si la verificación es exitosa, intentar login nuevamente
        await handleSubmit({ preventDefault: () => {} });
      } else {
        setError(result.message || 'Código de verificación incorrecto');
      }
    } catch (err) {
      setError('Error al verificar el código');
    } finally {
      setIsLoading(false);
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
            disabled={needsVerification}
          />
        </div>

        {needsVerification && (
          <div className="form-group verification-group">
            <label htmlFor="verificationCode">Código de Verificación</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Ingresa el código de 6 dígitos"
              maxLength={6}
              required
            />
            <small>Hemos enviado un código a tu correo electrónico</small>
          </div>
        )}

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

        <button 
          type={needsVerification ? "button" : "submit"} 
          className="login-button"
          onClick={needsVerification ? handleVerifyCode : undefined}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : needsVerification ? 'Verificar Código' : 'Ingresar'}
        </button>

        {needsVerification && (
          <button 
            type="button"
            className="resend-button"
            onClick={() => {
              setVerificationCode('');
              setNeedsVerification(false);
              setError('');
            }}
          >
            Cambiar Correo
          </button>
        )}

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