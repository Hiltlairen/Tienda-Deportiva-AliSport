import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TiendaForm from '../../components/Form/TiendaForm';
import Storage from '../../services/storage';

function SellerRegister() {
  const location = useLocation();
  const navigate = useNavigate();
  const id_usuario = location.state?.id_usuario;

  const [formData, setFormData] = useState({
    nombreTienda: '',
    ciPropietario: '',
    descripcion: '',
    nit: '',
    ubicacion: null,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id_usuario) {
      navigate('/login'); // Redirige si no hay ID de usuario
    }
  }, [id_usuario, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (location) => {
    console.log("📍 Ubicación recibida en SellerRegister:", location); // DEBUG
    setFormData((prev) => ({
      ...prev,
      ubicacion: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.ubicacion || !id_usuario) {
      setError('Ubicación e ID de usuario requeridos.');
      setLoading(false);
      return;
    }

    const payload = {
      id_usuario,
      nombreTienda: formData.nombreTienda,
      ciPropietario: formData.ciPropietario,
      descripcion: formData.descripcion,
      nit: formData.nit,
      lat: formData.ubicacion.latitude,
      lng: formData.ubicacion.longitude,
    };

    console.log("📦 Enviando datos al backend:", payload); // DEBUG

    try {
      const response = await fetch('http://localhost/back-ropa/l0gin_vende_cli/register_store.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      console.log("📥 Respuesta del backend:", data); // DEBUG

      if (data.success) {
        Storage.setStoreData({ id_tienda: data.id_tienda });
        setSuccess('Tienda registrada con éxito.');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Error al registrar tienda.');
      }
    } catch (err) {
      console.error('❌ Error al registrar tienda:', err);
      setError('Ocurrió un error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TiendaForm
          formData={formData}
          onInputChange={handleInputChange}
          onLocationSelect={handleLocationSelect}
        />

        {/* Mensajes */}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}

        {/* Botón de registro */}
        <div className="submit-btn-container">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Tienda'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SellerRegister;
