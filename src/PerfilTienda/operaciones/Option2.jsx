import React, { useState } from 'react';
import EditarPerfil from '../../components/EditPerfil/EditarPerfil';
import EditarTienda from '../../components/EditarTienda/EditarTienda';
import axios from 'axios';

const Option2 = ({ userInfo, tiendaData }) => {
  const [userData, setUserData] = useState(userInfo);
  const [tiendaDataState, setTiendaDataState] = useState(tiendaData);
  
  const handleSave = async (updatedData, type) => {
    try {
      let response;
  
      if (Object.values(updatedData).some(value => value === '')) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
      }
  
      if (type === 'usuario') {
        response = await axios.post('http://localhost/back-ropa/estado/editarPerfil.php', updatedData);
        if (response.data.success) {
          // Volver a consultar los datos actualizados del usuario
          const resLogin = await loginResponse.json(); 
          const loginResponse = await fetch('http://localhost/back-ropa/l0gin_vende_cli/login_usuario.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              correo: updatedData.correo,
              contrasena: updatedData.contrasena
            }),
          });
                  
  
          if (resLogin.success) {
            setUserData(resLogin.user);
          }else {
            alert('Error al recargar los datos del usuario.');
          }
        } else {
          alert('Error al actualizar los datos del usuario: ' + response.data.message);
        }
      }
  
      if (type === 'tienda' && userData.rol === 'vendedor') {
        const responseTienda = await axios.post('http://localhost/back-ropa/estado/editarTienda.php', updatedData);
        if (responseTienda.data.success) {
          // Reconsultar datos de la tienda con el ID actual
          const tiendaActualizada = await axios.get(`http://localhost/back-ropa/estado/obtenerTienda.php?id_usuario=${userData.id_usuario}`);
          if (tiendaActualizada.data.success) {
            setTiendaDataState(tiendaActualizada.data.tienda);
          } else {
            alert('No se pudo recargar la información de la tienda.');
          }
        } else {
          alert('Error al actualizar los datos de la tienda: ' + responseTienda.data.message);
        }
      }
  
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Ocurrió un error al guardar los cambios. Intenta de nuevo.');
    }
  };
  
  
  

  return (
    <div className="option2-container">
      <h2>Contenido de la Opción 2</h2>

      {/* Mostrar datos del usuario */}
      <div className="user-data-section">
        <h3>Datos del Usuario</h3>
        <ul>
          <li><strong>Nombre:</strong> {userData.nombre}</li>
          <li><strong>Correo:</strong> {userData.correo}</li>
          <li><strong>Rol:</strong> {userData.rol}</li>
        </ul>
      </div>

      {/* Mostrar datos de la tienda si existen */}
      {tiendaDataState && (
        <div className="tienda-data-section">
          <h3>Datos de la Tienda</h3>
          <ul>
            <li><strong>Nombre:</strong> {tiendaDataState.nombre_tienda}</li>
            <li><strong>CI Propietario:</strong> {tiendaDataState.ci_propietario}</li>
            <li><strong>NIT:</strong> {tiendaDataState.nit}</li>
            {tiendaDataState.descripcion && (
              <li><strong>Descripción:</strong> {tiendaDataState.descripcion}</li>
            )}
            {tiendaDataState.lat && tiendaDataState.lng && (
              <li><strong>Ubicación:</strong> Lat: {tiendaDataState.lat}, Lng: {tiendaDataState.lng}</li>
            )}
          </ul>
        </div>
      )}

      {/* Componente EditarPerfil */}
      <div className="edit-profile-section">
        <h3>Editar Perfil</h3>
        <EditarPerfil userData={userData} onSave={(updatedUser) => handleSave(updatedUser, 'usuario')} />
      </div>

      {/* Componente EditarTienda */}
      {userData.rol === 'vendedor' && (
        <div className="edit-tienda-section">
          <h3>Editar Tienda</h3>
          <EditarTienda tiendaData={tiendaDataState} onSave={(updatedTienda) => handleSave(updatedTienda, 'tienda')} />
        </div>
      )}
    </div>
  );
};

export default Option2;
