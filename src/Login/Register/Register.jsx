import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../conexion/estado';
import './Register.css';

const Register = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await authService.register(formData, userType);

    if (result.success) {
      navigate(userType === 'cliente' ? '/' : '/registrar-tienda');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Registro de {userType === 'cliente' ? 'Cliente' : 'Vendedor'}</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Nombre Completo</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="register-button">
          Registrarse como {userType === 'cliente' ? 'Cliente' : 'Vendedor'}
        </button>
      </form>
    </div>
  );
};

export default Register;