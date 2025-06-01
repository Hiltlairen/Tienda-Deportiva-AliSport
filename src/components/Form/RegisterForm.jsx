import React from 'react';

function RegisterForm({ fullName, email, password, phone, onChange }) {
  return (
    <div className="register-form">
      <div className="input-container">
        <input
          type="text"
          placeholder="Nombre completo"
          name="fullName"
          value={fullName}
          onChange={onChange}
          required
        />
      </div>
      <div className="input-container">
        <input
          type="email"
          placeholder="Correo electrónico"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
      </div>
      <div className="input-container">
        <input
          type="password"
          placeholder="Contraseña (mínimo 8 caracteres)"
          name="password"
          value={password}
          onChange={onChange}
          minLength="8"
          required
        />
      </div>
      <div className="input-container">
        <input
          type="tel"
          placeholder="Teléfono"
          name="phone"
          value={phone}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}

export default RegisterForm;
