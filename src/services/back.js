// src/api.js
const API_BASE_URL = 'http://localhost/back-ropa';

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/l0gin_vende_cli/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
};

export const getUserData = async (id_usuario) => {
  try {
    const response = await fetch(`${API_BASE_URL}/estado/nombreuser.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    throw error;
  }
};
export const fetchUserProfile = async (id_usuario) => {
  try {
    const response = await fetch(`${API_BASE_URL}/estado/perfil2.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario }),
    });
    const data = await response.json();
    if (data.success) {
      return data.usuario;
    } else {
      throw new Error(data.message || 'Error al obtener perfil de usuario');
    }
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};