import React, { useEffect, useState } from 'react';
import './Profile.css';

function PerfilTienda({ userData }) {
  const { id_usuario, rol } = userData;
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTienda = async () => {
      if (rol !== 'vendedor') {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost/back-ropa/estado/datos_vendedor.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_usuario }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error en la respuesta del servidor');
        }

        if (data.success) {
          setTienda(data.tienda);
        } else {
          setError(data.message || 'El vendedor no tiene tienda registrada');
        }
      } catch (err) {
        console.error('Error fetching tienda:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTienda();
  }, [id_usuario, rol]);

  if (loading) {
    return <div className="loading">Cargando datos de la tienda...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        {error.includes('no tiene tienda') && (
          <button 
            className="btn-primary"
            onClick={() => window.location.href = '/registrar-tienda'}
          >
            Registrar Tienda
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>{tienda?.nombre_tienda || `Perfil de ${userData.nombre}`}</h2>
        <p className="profile-subtitle">
          {tienda ? 'Tienda registrada' : 'Vendedor sin tienda registrada'}
        </p>
      </div>

      <div className="profile-content">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <span>
              {tienda 
                ? tienda.nombre_tienda.charAt(0).toUpperCase()
                : userData.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-section">
            <h3>Información personal</h3>
            <div className="info-row">
              <div className="info-label">Nombre:</div>
              <div className="info-value">{userData.nombre}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Correo:</div>
              <div className="info-value">{userData.correo}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Teléfono:</div>
              <div className="info-value">{userData.numero_telefonico}</div>
            </div>
          </div>

          {tienda && (
            <div className="info-section">
              <h3>Información de la tienda</h3>
              <div className="info-row">
                <div className="info-label">Nombre:</div>
                <div className="info-value">{tienda.nombre_tienda}</div>
              </div>
              <div className="info-row">
                <div className="info-label">CI Propietario:</div>
                <div className="info-value">{tienda.ci_propietario}</div>
              </div>
              <div className="info-row">
                <div className="info-label">NIT:</div>
                <div className="info-value">{tienda.nit}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Descripción:</div>
                <div className="info-value">{tienda.descripcion || 'Sin descripción'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Ubicación:</div>
                <div className="info-value">
                  Lat: {tienda.lat}, Lng: {tienda.lng}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilTienda;