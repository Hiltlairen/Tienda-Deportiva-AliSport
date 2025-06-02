import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapSelector from '../../components/MapSelector/MapSelector';
import { authService } from '../../conexion/estado';

const RegistrarTienda = () => {
    const [form, setForm] = useState({
        nombreTienda: '',
        ciPropietario: '',
        descripcion: '',
        nit: '',
        ubicacion: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user || user.rol !== 'vendedor') {
            navigate('/login', { state: { from: '/registrar-tienda' } });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await authService.registerShop(form);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard', { 
                state: { 
                    success: `Tienda "${form.nombreTienda}" registrada con éxito! 🎉`,
                    tienda: result.tienda
                }
            });
        } else {
            setError(result.isNetworkError 
                ? 'Error de conexión. Verifica tu red o intenta más tarde'
                : result.message
            );
        }
    };

    return (
        <div className="container">
            <h1>Registrar Nueva Tienda</h1>
            
            {error && <div className="alert error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de la Tienda *</label>
                    <input 
                        type="text" 
                        value={form.nombreTienda}
                        onChange={(e) => setForm({...form, nombreTienda: e.target.value})}
                        required
                        maxLength={100}
                    />
                </div>

                <div className="form-group">
                    <label>C.I. Propietario *</label>
                    <input 
                        type="text" 
                        value={form.ciPropietario}
                        onChange={(e) => setForm({...form, ciPropietario: e.target.value})}
                        required
                        pattern="[0-9]+"
                        title="Solo números"
                    />
                </div>

                <div className="form-group">
                    <label>NIT *</label>
                    <input 
                        type="text" 
                        value={form.nit}
                        onChange={(e) => setForm({...form, nit: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        value={form.descripcion}
                        onChange={(e) => setForm({...form, descripcion: e.target.value})}
                        maxLength={500}
                    />
                </div>

                <div className="form-group">
                    <label>Ubicación en Mapa *</label>
                    <MapSelector 
                        onLocationSelect={(loc) => setForm({...form, ubicacion: loc})}
                    />
                    {form.ubicacion && (
                        <div className="coords">
                            📍 Lat: {form.ubicacion.latitude.toFixed(4)}, Lng: {form.ubicacion.longitude.toFixed(4)}
                        </div>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !form.ubicacion}
                    className="btn-primary"
                >
                    {loading ? 'Registrando...' : 'Registrar Tienda'}
                </button>
            </form>
        </div>
    );
};

export default RegistrarTienda;