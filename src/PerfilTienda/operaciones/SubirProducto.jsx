import React, { useState } from 'react';
import { productoService } from '../../conexion/producto';
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
    url_3d: '',
    id_tienda: sessionStorage.getItem('id_tienda') || ''
  });

  const [selectedTallas, setSelectedTallas] = useState([]);
  const [selectedEdades, setSelectedEdades] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
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
        talla: newTallas.join(',')
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
        edades: newEdades.join(',')
      }));
      return newEdades;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      setMensaje({ text: 'Máximo 5 imágenes permitidas', type: 'error' });
      return;
    }

    setImages(files);
    
    // Crear vistas previas
    const newPreviews = files.map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise(resolve => {
        reader.onload = () => resolve(reader.result);
      });
    });

    Promise.all(newPreviews).then(results => {
      setPreviews(results);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensaje({ text: '', type: '' });

    // Validaciones
    const errors = [];
    if (images.length === 0) errors.push('Debes subir al menos una imagen');
    if (selectedTallas.length === 0) errors.push('Selecciona al menos una talla');
    if (selectedEdades.length === 0) errors.push('Selecciona al menos un rango de edad');
    if (!formData.nombre_producto.trim()) errors.push('El nombre del producto es requerido');
    if (!formData.precio || formData.precio <= 0) errors.push('El precio debe ser mayor a 0');
    if (!formData.categoria) errors.push('La categoría es requerida');

    if (errors.length > 0) {
      setMensaje({ text: errors.join(', '), type: 'error' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await productoService.uploadProduct(formData, images);

      if (result.success) {
        setMensaje({ 
          text: 'Producto publicado exitosamente!', 
          type: 'success' 
        });
        // Reset form
        setFormData({
          nombre_producto: '',
          precio: '',
          descripcion: '',
          categoria: '',
          cantidad_minima: 1,
          tiempo_produccion: '',
          talla: '',
          edades: '',
          url_3d: '',
          id_tienda: sessionStorage.getItem('id_tienda') || ''
        });
        setSelectedTallas([]);
        setSelectedEdades([]);
        setImages([]);
        setPreviews([]);
      } else {
        setMensaje({ 
          text: result.message || 'Error al publicar el producto', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ 
        text: error.message || 'Error al conectar con el servidor', 
        type: 'error' 
      });
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
        {/* Campos del formulario */}
        <div className="form-group">
          <label htmlFor="nombre_producto">Nombre del Producto *</label>
          <input
            id="nombre_producto"
            type="text"
            name="nombre_producto"
            value={formData.nombre_producto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio (Bs) *</label>
          <input
            id="precio"
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción *</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoría *</label>
          <select
            id="categoria"
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
          <label htmlFor="cantidad_minima">Cantidad mínima de pedido *</label>
          <input
            id="cantidad_minima"
            type="number"
            name="cantidad_minima"
            value={formData.cantidad_minima}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tiempo_produccion">Tiempo estimado de producción (días) *</label>
          <input
            id="tiempo_produccion"
            type="number"
            name="tiempo_produccion"
            value={formData.tiempo_produccion}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="url_3d">URL del modelo 3D (opcional)</label>
          <input
            id="url_3d"
            type="url"
            name="url_3d"
            value={formData.url_3d}
            onChange={handleChange}
            placeholder="https://ejemplo.com/modelo-3d"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagenes">Imágenes del producto (máx. 5) *</label>
          <input 
            id="imagenes"
            type="file" 
            multiple
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <div className="image-previews">
            {previews.map((preview, index) => (
              <div key={index} className="image-preview">
                <img src={preview} alt={`Vista previa ${index + 1}`} />
                <span>{images[index].name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Especificaciones</h3>

          <div className="form-group">
            <label>Tallas Disponibles *</label>
            <div className="multi-select-container">
              {tallasDisponibles.map(talla => (
                <button
                  type="button"
                  key={talla}
                  className={`multi-select-option ${selectedTallas.includes(talla) ? 'selected' : ''}`}
                  onClick={() => handleTallaChange(talla)}
                  aria-pressed={selectedTallas.includes(talla)}
                >
                  {talla}
                </button>
              ))}
            </div>
            <div className="selected-values">
              Seleccionadas: {selectedTallas.length > 0 ? selectedTallas.join(', ') : 'Ninguna'}
            </div>
          </div>

          <div className="form-group">
            <label>Rangos de Edad *</label>
            <div className="multi-select-container">
              {edadesDisponibles.map(edad => (
                <button
                  type="button"
                  key={edad}
                  className={`multi-select-option ${selectedEdades.includes(edad) ? 'selected' : ''}`}
                  onClick={() => handleEdadChange(edad)}
                  aria-pressed={selectedEdades.includes(edad)}
                >
                  {edad}
                </button>
              ))}
            </div>
            <div className="selected-values">
              Seleccionados: {selectedEdades.length > 0 ? selectedEdades.join(', ') : 'Ninguno'}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Publicando...
            </>
          ) : (
            'Publicar Producto'
          )}
        </button>
      </form>
    </div>
  );
};

export default SubirProducto;