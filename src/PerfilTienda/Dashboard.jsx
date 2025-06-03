import React, { useState, useEffect } from 'react';
import Cintaopt from './Cintaopt';
import Content from './Content';
import './style/Dashboard.css';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const userData = {
    id_usuario: sessionStorage.getItem('id_usuario'),
    nombre: sessionStorage.getItem('nombre'),    // Cambiado a sessionStorage
    correo: sessionStorage.getItem('correo'),    // Cambiado a sessionStorage
    rol: sessionStorage.getItem('rol')           // Cambiado a sessionStorage
  };

  if (userData.id_usuario && userData.rol) {  // Verifica solo lo esencial
    setUser(userData);
  }
  setIsLoading(false);
}, []);

  if (isLoading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user) {
    return (
      <div className="unauthorized">
        <p>Por favor, inicia sesión para acceder al dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <div className="welcome-section">
          <h1>Bienvenido, {user.nombre}</h1>
          <p className="user-email">
            {user.correo} | {user.rol === 'vendedor' ? 'Vendedor' : 'Cliente'}
          </p>
          
        </div>

        <div className="dashboard-container">
          <Cintaopt onSelectOption={setSelectedOption} />
          <Content selectedOption={selectedOption} userInfo={user} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
