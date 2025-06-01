import axios from 'axios';

const BASE_URL = 'http://localhost/back-ropa/producto';

export const getProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/obtenerProductos.php`);
    return response.data; // Debe ser un array de productos
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/obtenerProductoPorId.php?id=${id}`);
    return response.data; // Debe ser un objeto con los datos del producto
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error);
    throw error;
  }
};
