import React, { useEffect, useState } from 'react';
import Profile from '../components/Profile/Profile';
import PerfilTienda from '../components/Profile/PerfilTienda';
import { fetchUserProfile } from '../services/back';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Cambiamos a sessionStorage para coincidir con el Header
        const id_usuario = sessionStorage.getItem('id_usuario');
        
        if (!id_usuario) {
          // Si no hay id_usuario, redirigimos al login
          navigate('/login');
          return;
        }

        const userProfile = await fetchUserProfile(id_usuario);
        
        setUser({
          id_usuario,
          ...userProfile
        });
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError(err.message);
        // Redirigir al login si hay error
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  if (isLoading) {
    return <div className="loading">Cargando perfil...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  if (!user) {
    return null; // Ya redirigimos al login si no hay usuario
  }

  return (
    <div className="profile-page">
      <main>
        <h1>Perfil de {user.nombre}</h1>
        <p>ID: {user.id_usuario}</p>
        <p>{user.correo} | {user.rol}</p>

        <Profile userData={user} />
        
        {user.rol === 'vendedor' && <PerfilTienda userData={user} />}
      </main>
    </div>
  );
}

export default ProfilePage;