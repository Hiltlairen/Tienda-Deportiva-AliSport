// src/utils/storage.js

const Storage = {
    setUserData: (data) => {
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    },
  
    getUserData: () => {
      return {
        id_usuario: localStorage.getItem('id_usuario'),
        correo: localStorage.getItem('correo'),
        nombre: localStorage.getItem('nombre'),
        rol: localStorage.getItem('rol'),
        // Si decides guardar la contraseña (NO recomendado)
        // password: localStorage.getItem('password')
      };
    },
  
    clearUserData: () => {
      localStorage.removeItem('id_usuario');
      localStorage.removeItem('correo');
      localStorage.removeItem('nombre');
      localStorage.removeItem('rol');
      // localStorage.removeItem('password');
    },

    setStoreData: ({ id_tienda }) => {
        localStorage.setItem('id_tienda', id_tienda);
      },
    
      getStoreData: () => ({
        id_tienda: localStorage.getItem('id_tienda'),
      }),
    
      clearStoreData: () => {
        localStorage.removeItem('id_tienda');
      },
    
  };
  
  export default Storage;
  