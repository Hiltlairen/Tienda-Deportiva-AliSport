 // src/conexion/estado.js
const API_BASE_URL = 'http://localhost/back-ropa';

export const authService = {
  login: async (correo, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cuenta/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });

      const text = await response.text();
      const data = JSON.parse(text); // Forzar parseo (maneja errores después)

      if (data.success) {
        sessionStorage.setItem('id_usuario', data.id_usuario);
        sessionStorage.setItem('rol', data.rol);
        return { success: true, rol: data.rol };
      } else {
        throw new Error(data.message || "Error en la autenticación");
      }
    } catch (error) {
      console.error('Error en authService:', error);
      return { success: false, message: error.message };
    }
  },

  logout: () => {
    sessionStorage.clear();
    window.location.href = '/login';
  },

  getCurrentUser: () => ({
    id: sessionStorage.getItem('id_usuario'),
    rol: sessionStorage.getItem('rol'),
  }),

  isAuthenticated: () => !!sessionStorage.getItem('id_usuario'),



  register: async (formData, userType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cuenta/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rol: userType, // 'cliente' o 'vendedor'
        }),
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (!data.success) {
        throw new Error(data.message || "Error en el registro");
      }

      // Autenticar automáticamente después del registro
      const loginResult = await authService.login(formData.correo, formData.password);
      if (!loginResult.success) {
        throw new Error("Error al autenticar después del registro");
      }

      return { 
        success: true,
        user: {
          id: data.id_usuario,
          rol: data.rol,
          nombre: data.nombre
        }
      };

    } catch (error) {
      console.error('Error en authService.register:', error);
      return { success: false, message: error.message };
    }
  },

  //////REGISTRAR TIENDA
  registerShop: async (shopData) => {
    try {
        const user = authService.getCurrentUser();
        if (!user || user.rol !== 'vendedor') {
            throw new Error('Acceso restringido a vendedores');
        }

        // Validación de campos
        if (!shopData.nombreTienda || !shopData.ciPropietario || !shopData.nit || !shopData.ubicacion) {
            throw new Error('Todos los campos son obligatorios');
        }

        const response = await fetch(`${API_BASE_URL}/cuenta/registrar_tienda.php`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'token': sessionStorage.getItem('token') || '' 
            },
            body: JSON.stringify({
                id_usuario: user.id,
                nombreTienda: shopData.nombreTienda,
                ciPropietario: shopData.ciPropietario,
                descripcion: shopData.descripcion || '',
                lat: shopData.ubicacion.latitude,
                lng: shopData.ubicacion.longitude,
                nit: shopData.nit
            })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Error en el servidor");
        }

        // GUARDAR ID_TIENDA EN SESSIONSTORAGE
        sessionStorage.setItem('id_tienda', data.id_tienda);

        return {
            success: true,
            tienda: {
                id: data.id_tienda,
                nombre: shopData.nombreTienda,
                extra: data.extra
            },
            log: data.log
        };

    } catch (error) {
        console.error('Error en registerShop:', {
            error: error.message,
            stack: error.stack
        });
        return { 
            success: false, 
            message: error.message,
            isNetworkError: error.message.includes('Failed to fetch')
        };
    }
},
};