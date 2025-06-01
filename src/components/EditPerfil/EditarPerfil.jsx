import React, { useState } from 'react';
import './EditarPerfil.css';

const EditarPerfil = ({ userData, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: userData.nombre || '',
    correo: userData.correo || '',
    numero_telefonico: userData.numero_telefonico || '',
    contraseña: '',
    confirmar_contraseña: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'Correo electrónico inválido';
    }
    if (!formData.numero_telefonico.trim()) newErrors.numero_telefonico = 'El teléfono es requerido';
    
    if (formData.contraseña && formData.contraseña.length < 6) {
      newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.contraseña !== formData.confirmar_contraseña) {
      newErrors.confirmar_contraseña = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const { confirmar_contraseña, ...userToUpdate } = formData;
  
      if (!userToUpdate.contraseña) delete userToUpdate.contraseña;
  
      // 🔥 AÑADIR campos obligatorios que no se editan pero el backend requiere
      userToUpdate.id_usuario = userData.id_usuario;
      userToUpdate.rol = userData.rol;
  
      onSave(userToUpdate)
        .finally(() => setIsSubmitting(false));
    }
  };
  

  return (
    <div className="editar-perfil-container">
      <h2>Editar Perfil de Usuario</h2>
      <form onSubmit={handleSubmit} className="perfil-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error' : ''}
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className={errors.correo ? 'error' : ''}
          />
          {errors.correo && <span className="error-message">{errors.correo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="numero_telefonico">Número Telefónico</label>
          <input
            type="tel"
            id="numero_telefonico"
            name="numero_telefonico"
            value={formData.numero_telefonico}
            onChange={handleChange}
            className={errors.numero_telefonico ? 'error' : ''}
          />
          {errors.numero_telefonico && <span className="error-message">{errors.numero_telefonico}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contraseña">Nueva Contraseña (dejar en blanco para no cambiar)</label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className={errors.contraseña ? 'error' : ''}
          />
          {errors.contraseña && <span className="error-message">{errors.contraseña}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmar_contraseña">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmar_contraseña"
            name="confirmar_contraseña"
            value={formData.confirmar_contraseña}
            onChange={handleChange}
            className={errors.confirmar_contraseña ? 'error' : ''}
          />
          {errors.confirmar_contraseña && <span className="error-message">{errors.confirmar_contraseña}</span>}
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

export default EditarPerfil;
