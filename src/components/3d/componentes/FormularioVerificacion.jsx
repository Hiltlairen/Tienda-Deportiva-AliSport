// FormularioVerificacion.jsx
import React, { useState } from "react";
import "./FormularioVerificacion.css";

const FormularioVerificacion = ({ onSubmit, onCancel, disenoData }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    categoria: "polera",
    tallas: [],
    contacto: "",
    telefono: "",
    email: "",
    ubicacion: "",
    terminos: false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleTallasChange = (talla) => {
    setFormData(prev => ({
      ...prev,
      tallas: prev.tallas.includes(talla)
        ? prev.tallas.filter(t => t !== talla)
        : [...prev.tallas, talla]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = "El título es obligatorio";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria";
    if (!formData.precio.trim()) newErrors.precio = "El precio es obligatorio";
    if (formData.tallas.length === 0) newErrors.tallas = "Debe seleccionar al menos una talla";
    if (!formData.contacto.trim()) newErrors.contacto = "El nombre de contacto es obligatorio";
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
    if (!formData.ubicacion.trim()) newErrors.ubicacion = "La ubicación es obligatoria";
    if (!formData.terminos) newErrors.terminos = "Debe aceptar los términos y condiciones";

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    // Validar precio
    if (formData.precio && isNaN(parseFloat(formData.precio))) {
      newErrors.precio = "El precio debe ser un número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        diseno: disenoData,
        fechaPublicacion: new Date().toISOString()
      });
    }
  };

  const tallasDisponibles = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="formulario-wrapper">
      <div className="formulario-container">
        <header className="formulario-header">
          <h1>📤 Publicar Diseño</h1>
          <p>Complete la información para publicar su nuevo diseño</p>
        </header>

        <form onSubmit={handleSubmit} className="formulario-form">
          <div className="form-section">
            <h2>Información del Producto</h2>
            
            <div className="form-group">
              <label htmlFor="titulo">Título del diseño *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Ej: Polera Deportiva Personalizada"
                className={errors.titulo ? "error" : ""}
              />
              {errors.titulo && <span className="error-message">{errors.titulo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe tu diseño, materiales, características especiales..."
                className={errors.descripcion ? "error" : ""}
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precio">Precio (Bs.) *</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  placeholder="150"
                  min="0"
                  step="0.01"
                  className={errors.precio ? "error" : ""}
                />
                {errors.precio && <span className="error-message">{errors.precio}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="categoria">Categoría</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                >
                  <option value="polera">Polera</option>
                  <option value="top">Top</option>
                  <option value="canguro">Canguro</option>
                  <option value="gorra">Gorra</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tallas disponibles *</label>
              <div className="tallas-grid">
                {tallasDisponibles.map(talla => (
                  <label key={talla} className="talla-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.tallas.includes(talla)}
                      onChange={() => handleTallasChange(talla)}
                    />
                    <span>{talla}</span>
                  </label>
                ))}
              </div>
              {errors.tallas && <span className="error-message">{errors.tallas}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2>Información de Contacto</h2>
            
            <div className="form-group">
              <label htmlFor="contacto">Nombre de contacto *</label>
              <input
                type="text"
                id="contacto"
                name="contacto"
                value={formData.contacto}
                onChange={handleInputChange}
                placeholder="Su nombre o nombre de la tienda"
                className={errors.contacto ? "error" : ""}
              />
              {errors.contacto && <span className="error-message">{errors.contacto}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono/WhatsApp *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="70123456"
                  className={errors.telefono ? "error" : ""}
                />
                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="contacto@ejemplo.com"
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ubicacion">Ubicación *</label>
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
                placeholder="Ciudad, zona o dirección de referencia"
                className={errors.ubicacion ? "error" : ""}
              />
              {errors.ubicacion && <span className="error-message">{errors.ubicacion}</span>}
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="terminos"
                  checked={formData.terminos}
                  onChange={handleInputChange}
                  className={errors.terminos ? "error" : ""}
                />
                <span>Acepto los términos y condiciones y autorizo la publicación de mi diseño *</span>
              </label>
              {errors.terminos && <span className="error-message">{errors.terminos}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
            >
              Publicar Diseño
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioVerificacion;