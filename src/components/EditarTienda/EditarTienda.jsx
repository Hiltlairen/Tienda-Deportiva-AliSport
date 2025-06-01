import React, { useState, useEffect } from 'react';
import MapSelector from '../MapSelector/MapSelector';
import './EditarTienda.css';

const EditarTienda = ({ tiendaData, onSave }) => {
  const [formData, setFormData] = useState({
    nombre_tienda: tiendaData?.nombre_tienda || '',
    ci_propietario: tiendaData?.ci_propietario || '',
    nit: tiendaData?.nit || '',
    descripcion: tiendaData?.descripcion || '',
    lat: tiendaData?.ubicacion?.coordinates?.[1] || '', // Cambio en la estructura de ubicación
    lng: tiendaData?.ubicacion?.coordinates?.[0] || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapPosition, setMapPosition] = useState(
    tiendaData?.ubicacion?.coordinates 
      ? [tiendaData.ubicacion.coordinates[1], tiendaData.ubicacion.coordinates[0]] 
      : null
  );

  useEffect(() => {
    // Actualizar posición del mapa cuando cambien los datos de la tienda
    if (tiendaData?.ubicacion?.coordinates) {
      setMapPosition([
        tiendaData.ubicacion.coordinates[1], 
        tiendaData.ubicacion.coordinates[0]
      ]);
    }
  }, [tiendaData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      lat: location.latitude,
      lng: location.longitude
    }));
    setMapPosition([location.latitude, location.longitude]);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre_tienda.trim()) newErrors.nombre_tienda = 'El nombre de la tienda es requerido';
    if (!formData.ci_propietario.trim()) newErrors.ci_propietario = 'El CI del propietario es requerido';
    if (!formData.nit.trim()) newErrors.nit = 'El NIT es requerido';
    
    // Validación de coordenadas
    if (!formData.lat || isNaN(formData.lat)) newErrors.lat = 'Seleccione una ubicación en el mapa';
    if (!formData.lng || isNaN(formData.lng)) newErrors.lng = 'Seleccione una ubicación en el mapa';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
  
      const tiendaToUpdate = {
        ...formData,
        ubicacion: {
          type: 'Point',
          coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)]
        }
      };
  
      // Agrega los campos obligatorios que no se editan directamente
      tiendaToUpdate.id_usuario = tiendaData.id_usuario;
      tiendaToUpdate.rol = tiendaData.rol;
  
      // Eliminar los campos temporales
      delete tiendaToUpdate.lat;
      delete tiendaToUpdate.lng;
  
      onSave(tiendaToUpdate)
        .finally(() => setIsSubmitting(false));
    }
  };
  

  return (
    <div className="editar-tienda-container">
      <h2>{tiendaData ? 'Editar Tienda' : 'Registrar Nueva Tienda'}</h2>
      <form onSubmit={handleSubmit} className="tienda-form">
        <div className="form-group">
          <label htmlFor="nombre_tienda">Nombre de la Tienda *</label>
          <input
            type="text"
            id="nombre_tienda"
            name="nombre_tienda"
            value={formData.nombre_tienda}
            onChange={handleChange}
            className={errors.nombre_tienda ? 'error' : ''}
            maxLength="100"
          />
          {errors.nombre_tienda && <span className="error-message">{errors.nombre_tienda}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ci_propietario">CI Propietario *</label>
            <input
              type="text"
              id="ci_propietario"
              name="ci_propietario"
              value={formData.ci_propietario}
              onChange={handleChange}
              className={errors.ci_propietario ? 'error' : ''}
              maxLength="20"
            />
            {errors.ci_propietario && <span className="error-message">{errors.ci_propietario}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nit">NIT *</label>
            <input
              type="text"
              id="nit"
              name="nit"
              value={formData.nit}
              onChange={handleChange}
              className={errors.nit ? 'error' : ''}
              maxLength="20"
            />
            {errors.nit && <span className="error-message">{errors.nit}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Ubicación en el Mapa *</label>
          <MapSelector 
            onLocationSelect={handleLocationSelect}
            initialPosition={mapPosition}
          />
          {errors.lat && (
            <span className="error-message" style={{ display: 'block', marginTop: '5px' }}>
              {errors.lat}
            </span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lat">Latitud</label>
            <input
              type="text"
              id="lat"
              name="lat"
              value={formData.lat}
              readOnly
              className="read-only"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lng">Longitud</label>
            <input
              type="text"
              id="lng"
              name="lng"
              value={formData.lng}
              readOnly
              className="read-only"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="save-button"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarTienda;