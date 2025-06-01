import React, { useState } from 'react';
import axios from 'axios';
import './SubirProducto.css';

const tallasDisponibles = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única'];
const edadesDisponibles = ['0-2 años', '3-5 años', '6-12 años', '13-14 años', '15-17 años', '18-25 años', '25-35 años', '35+ años'];
const categoriasDisponibles = [
  'Poleras',
  'Conjunto deportivo (polera y short)',
  'Conjunto deportivo (polera, short, chamarra y buzo)',
  'Gorras',
  'Parkas',
  'Pantalones',
  'Shorts',
  'Accesorios'
];

const SubirProducto = ({ userInfo, tiendaData }) => {
  const [formData, setFormData] = useState({
    nombre_producto: '',
    precio: '',
    descripcion: '',
    categoria: '',
    cantidad_minima: 1,
    tiempo_produccion: '',
    talla: '',
    edades: '',
    url_3d: ''
  });

  const [selectedTallas, setSelectedTallas] = useState([]);
  const [selectedEdades, setSelectedEdades] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTallaChange = (talla) => {
    setSelectedTallas(prev => {
      const newTallas = prev.includes(talla)
        ? prev.filter(t => t !== talla)
        : [...prev, talla];
      setFormData(prev => ({
        ...prev,
        talla: newTallas.join(', ')
      }));
      return newTallas;
    });
  };

  const handleEdadChange = (edad) => {
    setSelectedEdades(prev => {
      const newEdades = prev.includes(edad)
        ? prev.filter(e => e !== edad)
        : [...prev, edad];
      setFormData(prev => ({
        ...prev,
        edades: newEdades.join(', ')
      }));
      return newEdades;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensaje({ text: '', type: '' });

    if (selectedTallas.length === 0) {
      setMensaje({ text: 'Seleccione al menos una talla', type: 'error' });
      setIsSubmitting(false);
      return;
    }

    if (selectedEdades.length === 0) {
      setMensaje({ text: 'Seleccione al menos un rango de edad', type: 'error' });
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (imagen) {
        formDataToSend.append('imagen', imagen);
      }

      if (tiendaData?.id_tienda) {
        formDataToSend.append('id_tienda', tiendaData.id_tienda);
      }

      const response = await axios.post(
        'http://localhost/back-ropa/dashboard/subirProducto.php',
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        setMensaje({ text: 'Producto publicado exitosamente!', type: 'success' });
        setFormData({
          nombre_producto: '',
          precio: '',
          descripcion: '',
          categoria: '',
          cantidad_minima: 1,
          tiempo_produccion: '',
          talla: '',
          edades: '',
          url_3d: ''
        });
        setSelectedTallas([]);
        setSelectedEdades([]);
        setImagen(null);
        setPreviewImagen(null);
      } else {
        setMensaje({ text: response.data.message || 'Error al publicar el producto', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ text: error.response?.data?.message || 'Error al conectar con el servidor', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="subir-producto-container">
      <h2>Publicar Nuevo Producto</h2>
      {tiendaData && (
        <p className="tienda-info">Publicando como: <strong>{tiendaData.nombre_tienda}</strong></p>
      )}

      {mensaje.text && (
        <div className={`mensaje ${mensaje.type}`}>
          {mensaje.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="producto-form">
        <div className="form-group">
          <label>Nombre del Producto *</label>
          <input
            type="text"
            name="nombre_producto"
            value={formData.nombre_producto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Precio *</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción *</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Categoría *</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categoriasDisponibles.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Cantidad mínima de pedido *</label>
          <input
            type="number"
            name="cantidad_minima"
            value={formData.cantidad_minima}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Tiempo estimado de producción (en días) *</label>
          <input
            type="number"
            name="tiempo_produccion"
            value={formData.tiempo_produccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>URL del modelo 3D (opcional)</label>
          <input
            type="text"
            name="url_3d"
            value={formData.url_3d}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Imagen del producto *</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
          {previewImagen && (
            <div className="preview-imagen">
              <img src={previewImagen} alt="Vista previa" />
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Especificaciones</h3>

          <div className="form-group">
            <label>Tallas Disponibles *</label>
            <div className="multi-select-container">
              {tallasDisponibles.map(talla => (
                <div
                  key={talla}
                  className={`multi-select-option ${selectedTallas.includes(talla) ? 'selected' : ''}`}
                  onClick={() => handleTallaChange(talla)}
                >
                  {talla}
                </div>
              ))}
            </div>
            <input type="hidden" name="talla" value={formData.talla} />
            <div className="selected-values">
              Seleccionadas: {selectedTallas.length > 0 ? selectedTallas.join(', ') : 'Ninguna'}
            </div>
          </div>

          <div className="form-group">
            <label>Rangos de Edad *</label>
            <div className="multi-select-container">
              {edadesDisponibles.map(edad => (
                <div
                  key={edad}
                  className={`multi-select-option ${selectedEdades.includes(edad) ? 'selected' : ''}`}
                  onClick={() => handleEdadChange(edad)}
                >
                  {edad}
                </div>
              ))}
            </div>
            <input type="hidden" name="edades" value={formData.edades} />
            <div className="selected-values">
              Seleccionados: {selectedEdades.length > 0 ? selectedEdades.join(', ') : 'Ninguno'}
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Publicando...' : 'Publicar Producto'}
        </button>
      </form>
    </div>
  );
};

export default SubirProducto;
