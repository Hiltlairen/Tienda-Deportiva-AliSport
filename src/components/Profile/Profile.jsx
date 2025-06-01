import React from 'react';
import './Profile.css';

function Profile({ userData }) {
  const { nombre, correo, numero_telefonico, rol } = userData;

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>Perfil de {nombre}</h2>
      </div>

      <div className="profile-content">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <span>{nombre ? nombre.charAt(0).toUpperCase() : '?'}</span>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-section">
            <h3>Información personal</h3>
            <div className="info-row">
              <div className="info-label">Nombre:</div>
              <div className="info-value">{nombre}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Correo:</div>
              <div className="info-value">{correo}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Teléfono:</div>
              <div className="info-value">{numero_telefonico}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Rol:</div>
              <div className="info-value">{rol}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;