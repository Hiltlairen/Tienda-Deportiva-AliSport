import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import EstadisticasPopulares from "../components/EstadisticasPopulares/EstadisticasPopulares";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import Chart from "chart.js/auto";
import './Reportes.css';

const Reportes = () => {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [ventas, setVentas] = useState([]);
  const [populares, setPopulares] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost/back-ropa/dashboard/productos_populares.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPopulares(data.datos);
      });
  }, []);

  const obtenerReporte = async () => {
    const fDesde = new Date(desde).toISOString().split("T")[0];
    const fHasta = new Date(hasta).toISOString().split("T")[0];

    try {
      const res = await fetch("http://localhost/back-ropa/dashboard/reportes_ventas.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desde: fDesde, hasta: fHasta }),
      });
      const data = await res.json();
      if (data.success) setVentas(data.ventas);
      else alert("Error: " + data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

const exportarPDF = () => {
  const doc = new jsPDF();
  const fechaActual = new Date().toLocaleString();

  const logoUrl = `${window.location.origin}/logo.png`;
  const img = new Image();
  img.src = logoUrl;

  img.onload = () => {
    doc.addImage(img, 'PNG', 14, 10, 30, 15);
    doc.setFontSize(12);
    doc.text("Reporte de Ventas por Período", 50, 20);
    doc.text(`Generado el: ${fechaActual}`, 50, 28);

    autoTable(doc, {
      head: [["ID", "Cliente", "Producto", "Fecha", "Cantidad", "Total"]],
      body: ventas.map(v => [v.id_venta, v.nombre_cliente, v.nombre_producto, v.fecha, v.cantidad, v.total]),
      startY: 35
    });

    doc.addPage();
    doc.text("Diseños más populares", 14, 20);
    autoTable(doc, {
      head: [["#", "Producto", "Veces vendido", "Monto total"]],
      body: populares.map((item, i) => [i + 1, item.nombre_producto, item.veces_vendido, item.monto_total]),
      startY: 30
    });

    const canvas = document.getElementById("graficoBarras");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      doc.addPage();
      doc.text("Gráfico de Ventas", 14, 20);
      doc.addImage(imgData, "PNG", 14, 30, 180, 100);
    }

    // ✅ Abrir en nueva pestaña
    window.open(doc.output("bloburl"), "_blank");
  };

  img.onerror = () => {
    alert("Error cargando el logo. Verifica que esté en /public/logo.png");
  };
};



  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(ventas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Ventas");
    XLSX.writeFile(workbook, "reporte_ventas.xlsx");
  };

  return (
    <div className="reportes-container">
      <h2>📊 Reporte de Ventas por Período</h2>
      <div>
        <label>Desde: </label>
        <input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
        <label>Hasta: </label>
        <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
        <button onClick={obtenerReporte}>Generar Reporte</button>
      </div>

      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <button
          onClick={exportarPDF}
          style={{
            backgroundColor: "#d32f2f",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: "8px" }} />
          PDF
        </button>
        <button
          onClick={exportarExcel}
          style={{
            backgroundColor: "#388e3c",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            marginLeft: "10px",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon icon={faFileExcel} style={{ marginRight: "8px" }} />
          Excel
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Fecha</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v, i) => (
            <tr key={i}>
              <td>{v.id_venta}</td>
              <td>{v.nombre_cliente}</td>
              <td>{v.nombre_producto}</td>
              <td>{v.fecha}</td>
              <td>{v.cantidad}</td>
              <td>{v.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "2rem" }}>
        <EstadisticasPopulares chartRef={chartRef} />
      </div>
    </div>
  );
};

export default Reportes;
