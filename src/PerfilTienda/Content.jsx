import React, { useEffect, useState } from 'react';
import Option1 from './operaciones/SubirProducto';
import Option2 from './operaciones/Option2';
import Option3 from './operaciones/Option3';
import Profile from '../components/Profile/Profile';
import PerfilTienda from '../components/Profile/PerfilTienda';

const Content = ({ selectedOption, userInfo }) => {
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userInfo?.id_usuario) {
          const res = await fetch('http://localhost/back-ropa/estado/datos_vendedor.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: userInfo.id_usuario }),
          });

          const data = await res.json();
          if (data.success) {
            setTienda(data.tienda);
          }
        }
      } catch (err) {
        console.error('Error al obtener datos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  if (!userInfo) {
    return (
      <div className="unauthorized">
        <p>Por favor, inicia sesión para acceder al contenido.</p>
      </div>
    );
  }

  return (
    <div className="content">
      {selectedOption === 1 && <Option1 userInfo={userInfo} tiendaData={tienda} />}
      {selectedOption === 2 && <Option2 userInfo={userInfo} tiendaData={tienda} />}
      {selectedOption === 3 && <Option3 userInfo={userInfo} tiendaData={tienda} />}
      
      {!selectedOption && (
        <div className="welcome-message">
          <h2>Panel de Control</h2>
          <p>Selecciona una opción del menú lateral para comenzar.</p>

          <PerfilTienda userData={userInfo} tiendaData={tienda} />
        </div>
      )}
    </div>
  );
};

export default Content;