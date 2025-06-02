// src/conexion/producto.js
const API_BASE_URL = 'http://localhost/back-ropa';

export const productoService = {
  uploadProduct: async (productData, images) => {
    try {
      const formData = new FormData();
      
      // Agregar datos del producto
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
      
      // Agregar imágenes (múltiples)
      images.forEach((image, index) => {
        formData.append(`images[]`, image);
      });

      const response = await fetch(`${API_BASE_URL}/dashboard/subir_producto.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error al subir el producto");
      }

      return {
        success: true,
        productId: data.productId,
        imageUrls: data.imageUrls
      };
    } catch (error) {
      console.error('Error en productoService:', error);
      return {
        success: false,
        message: error.message || 'Error al conectar con el servidor'
      };
    }
  }
};