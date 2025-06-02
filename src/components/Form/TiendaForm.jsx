import React from 'react';
import MapSelector from '../MapSelector/MapSelector';
import './TiendaForm.css';

const TiendaForm = ({ formData, onInputChange, onLocationSelect }) => {
  return (
    <div className="tienda-form-container">
      <h2 className="tienda-form-title">Registrar Nueva Tienda</h2>

      <div className="tienda-form">
        {/* Nombre de la tienda */}
        <div className="input-container">
          <label className="input-label">Nombre de la Tienda</label>
          <input
            type="text"
            name="nombreTienda"
            value={formData.nombreTienda}
            onChange={onInputChange}
            className="input-field"
            required
          />
        </div>

        {/* CI del propietario */}
        <div className="input-container">
          <label className="input-label">CI del Propietario</label>
          <input
            type="text"
            name="ciPropietario"
            value={formData.ciPropietario}
            onChange={onInputChange}
            className="input-field"
            required
          />
        </div>

        {/* Descripción */}
        <div className="input-container">
          <label className="input-label">Descripción (opcional)</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={onInputChange}
            className="input-field textarea-field"
          />
        </div>

        {/* NIT */}
        <div className="input-container">
          <label className="input-label">NIT</label>
          <input
            type="text"
            name="nit"
            value={formData.nit}
            onChange={onInputChange}
            className="input-field"
            required
          />
        </div>

        {/* Ubicación */}
        <div className="input-container">
          <label className="input-label">Ubicación de la Tienda</label>
          <MapSelector onLocationSelect={onLocationSelect} />

          {/* Mostrar ubicación solo si existe */}
          <div className="location-message">
            {formData.ubicacion ? (
              `Ubicación seleccionada: ${formData.ubicacion.latitude?.toFixed(4)}, ${formData.ubicacion.longitude?.toFixed(4)}`
            ) : (
              "Seleccione una ubicación en el mapa"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiendaForm;