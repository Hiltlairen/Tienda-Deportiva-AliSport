// src/services/CategoriaService.js

const API_URL = "http://localhost/back-ropa/l0gin_vende_cli/get-categorias.php";

const CategoriaService = {
  async getCategorias() {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error al obtener categorías");
      }
      return data.data; // Retornamos directamente las categorías
    } catch (error) {
      console.error("Error en getCategorias:", error.message);
      throw error;
    }
  }
};

export default CategoriaService;
