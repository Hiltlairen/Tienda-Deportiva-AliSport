import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TiendaPage.css';

function TiendaPage() {
  const { id } = useParams();
  const [tienda, setTienda] = useState(null);

  useEffect(() => {
    // Aquí iría tu llamada API para obtener los datos de la tienda
    const fetchTienda = async () => {
      try {
        const response = await fetch(`/api/tiendas/${id}`);
        const data = await response.json();
        setTienda(data);
      } catch (error) {
        console.error('Error al cargar tienda:', error);
      }
    };

    fetchTienda();
  }, [id]);

  return (
    <div className="tienda-page">
      <h1>Página de la Tienda</h1>
      {tienda ? (
        <div>
          <h2>ID Tienda: {tienda.id_tienda}</h2>
          <p>Nombre: {tienda.nombre_tienda}</p>
          {/* Más detalles de la tienda aquí */}
        </div>
      ) : (
        <p>Cargando información de la tienda...</p>
      )}
    </div>
  );
}

export default TiendaPage;