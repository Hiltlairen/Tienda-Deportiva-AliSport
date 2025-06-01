import React from 'react';
import MapSelector from '../MapSelector/MapSelector';

const TiendaForm = ({ formData, onInputChange, onLocationSelect }) => {
  return (
    <div className="login-container">
      <h2 className="text-2xl font-bold mb-4">Registrar Nueva Tienda</h2>

      <div className="login-form">
        {/* Nombre de la tienda */}
        <div className="input-container">
          <label className="font-semibold mb-1">Nombre de la Tienda</label>
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
          <label className="font-semibold mb-1">CI del Propietario</label>
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
          <label className="font-semibold mb-1">Descripción (opcional)</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={onInputChange}
            className="input-field"
          />
        </div>

        {/* NIT */}
        <div className="input-container">
          <label className="font-semibold mb-1">NIT</label>
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
          <label className="font-semibold mb-1">Ubicación de la Tienda</label>
          <MapSelector onLocationSelect={onLocationSelect} />

          {/* Mostrar ubicación solo si existe */}
          <div className="mt-2 text-sm text-green-700">
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
