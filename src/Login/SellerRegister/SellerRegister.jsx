import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TiendaForm from '../../components/Form/TiendaForm';
import Storage from '../../services/storage';
import { fetchUserProfile } from '../../services/back';

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
      navigate('/login');
    }
  }, [id_usuario, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      ubicacion: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
  };

  const handleLoginAfterRegister = async () => {
    try {
      // Obtenemos el perfil del usuario usando el id_usuario
      const userProfile = await fetchUserProfile(id_usuario);
      
      if (userProfile) {
        // Guardamos los datos del usuario en el Storage
        Storage.setUserData({
          id_usuario: id_usuario,
          correo: userProfile.correo,
          rol: 'vendedor', // Asumimos que es vendedor ya que está registrando tienda
          ...userProfile
        });

        // Redirigimos al dashboard del vendedor
        navigate('/dashboard');
      } else {
        setError('No se pudo obtener el perfil del usuario');
      }
    } catch (err) {
      console.error('Error al obtener perfil:', err);
      setError('Ocurrió un error al cargar el perfil del usuario');
    }
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
      
      if (data.success) {
        Storage.setStoreData({ id_tienda: data.id_tienda });
        setSuccess('Tienda registrada con éxito.');
        
        // Después de registrar la tienda, cargamos el perfil y redirigimos
        await handleLoginAfterRegister();
      } else {
        setError(data.message || 'Error al registrar tienda.');
      }
    } catch (err) {
      console.error('Error al registrar tienda:', err);
      setError('Ocurrió un error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-register-page flex flex-center">
      <div className="seller-register-container">
        <h1 className="seller-brand-title">ALISPORT</h1>
        <h2 className="seller-form-title">Registrar Nueva Tienda</h2>
        
        <form onSubmit={handleSubmit}>
          <TiendaForm
            formData={formData}
            onInputChange={handleInputChange}
            onLocationSelect={handleLocationSelect}
          />

          {error && <p className="seller-error-message">{error}</p>}
          {success && <p className="seller-success-message">{success}</p>}

          <button
            type="submit"
            className="seller-submit-btn"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Tienda'}
          </button>
        </form>
        
        <div className="seller-form-footer">
          <div className="seller-footer-links">
            <a href="#">Términos y condiciones</a>
            <a href="#">Política de privacidad</a>
            <a href="#">Contacto</a>
          </div>
          <div className="seller-copyright">
            © {new Date().getFullYear()} Todos los derechos reservados
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerRegister;