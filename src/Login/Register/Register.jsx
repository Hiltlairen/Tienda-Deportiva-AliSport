import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import RegisterForm from '../../components/Form/RegisterForm';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'cliente'; // 'cliente' por defecto

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { fullName, email, password, phone } = formData;

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError('Ingresa un correo válido');
      return;
    }

    try {
      // Paso 1: REGISTRAR USUARIO
      const registerResponse = await fetch('http://localhost/back-ropa/l0gin_vende_cli/registrar_usuario.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: fullName,
          correo: email,
          password: password,
          telefono: phone,
          rol: role
        }),
      });

      const registerData = await registerResponse.json();
      console.log('Respuesta registro:', registerData);

      if (!registerData.success) {
        setError(registerData.message || 'Error al registrar usuario');
        return;
      }

      const id_usuario = registerData.id_usuario;

      // Paso 2: LOGIN AUTOMÁTICO
      const loginResponse = await fetch('http://localhost/back-ropa/l0gin_vende_cli/login_usuario.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: email,
          password: password
        }),
      });

      const loginData = await loginResponse.json();
      console.log('Respuesta login:', loginData);

      if (loginData.success) {
        localStorage.setItem('correo', loginData.correo);
        localStorage.setItem('nombre', loginData.nombre);
        localStorage.setItem('rol', loginData.rol);

        if (role === 'vendedor') {
          navigate('/seller-register', { state: { id_usuario } });
        } else {
          navigate('/');
        }
      } else {
        setError('Registro exitoso, pero error al iniciar sesión automáticamente.');
      }

    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error de conexión. Intenta nuevamente.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="register-logo" />
          <h1 id="inicio">
            {role === 'vendedor' ? 'Registro Inicial de Vendedor' : 'Registro de Cliente'}
          </h1>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <RegisterForm
            fullName={formData.fullName}
            email={formData.email}
            password={formData.password}
            phone={formData.phone}
            onChange={handleChange}
          />

          <button type="submit" className="submit2-btn">
            {role === 'vendedor' ? 'Continuar como Vendedor' : 'Registrarme como Cliente'}
          </button>
        </form>

        <div className="register-links">
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
