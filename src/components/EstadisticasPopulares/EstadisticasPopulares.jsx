import React, { useEffect, useState, useRef } from "react";
import './EstadisticasPopulares.css';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const EstadisticasPopulares = () => {
  const [datos, setDatos] = useState([]);
  const chartRef = useRef(null); // 👈 referencia al canvas

  useEffect(() => {
    fetch("http://localhost/back-ropa/dashboard/productos_populares.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDatos(data.datos);
        }
      })
      .catch((err) => {
        console.error("Error al obtener estadísticas:", err);
      });
  }, []);

  useEffect(() => {
    // Le asignamos manualmente el id al canvas cuando se monta
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      if (canvas) canvas.setAttribute("id", "graficoBarras");
    }
  }, [datos]); // se asegura de hacerlo cuando hay datos

  const chartData = {
    labels: datos.map(d => d.nombre_producto),
    datasets: [
      {
        label: "Veces Vendido",
        data: datos.map(d => d.veces_vendido),
        backgroundColor: "#4A90E2"
      }
    ]
  };

  return (
    <div className="estadisticas-container">
      <h3>📈 Diseños más populares</h3>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Veces vendido</th>
            <th>Monto total (Bs)</th>
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.nombre_producto}</td>
                <td>{item.veces_vendido}</td>
                <td>{parseFloat(item.monto_total).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ⬇ Aquí está el gráfico con id asignado */}
      <div className="grafico-container">
        <Bar
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false
          }}
        />
      </div>
    </div>
  );
};

export default EstadisticasPopulares;
