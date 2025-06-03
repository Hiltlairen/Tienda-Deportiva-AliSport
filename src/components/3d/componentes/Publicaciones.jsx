// Publicaciones.jsx
import React, { useState, useEffect } from "react";
import "./Publicaciones.css";

const Publicaciones = ({ onBack }) => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroOrden, setFiltroOrden] = useState("recientes");
  const [busqueda, setBusqueda] = useState("");

  // Datos de ejemplo - en una aplicación real vendrían de una API
  useEffect(() => {
    const publicacionesEjemplo = [
      {
        id: 1,
        titulo: "Polera Deportiva Personalizada",
        descripcion: "Polera de algodón 100% con diseño deportivo personalizado",
        precio: 150,
        categoria: "polera",
        tallas: ["S", "M", "L", "XL"],
        contacto: "María González",
        telefono: "70123456",
        email: "maria@ejemplo.com",
        ubicacion: "La Paz, Zona Sur",
        fechaPublicacion: "2024-01-15",
        imagen: "/api/placeholder/300/300",
        diseno: {
          color: "#ff6b6b",
          stickers: [],
          texts: [{ content: "TEAM 2024", color: "#ffffff" }]
        }
      },
      {
        id: 2,
        titulo: "Gorra Personalizada Logo",
        descripcion: "Gorra ajustable con bordado personalizado, varios colores disponibles",
        precio: 80,
        categoria: "gorra",
        tallas: ["Única"],
        contacto: "Carlos Mendoza",
        telefono: "71234567",
        email: "carlos@ejemplo.com",
        ubicacion: "Cochabamba Centro",
        fechaPublicacion: "2024-01-14",
        imagen: "/api/placeholder/300/300",
        diseno: {
          color: "#4ecdc4",
          stickers: [],
          texts: [{ content: "CM", color: "#000000" }]
        }
      },
      {
        id: 3,
        titulo: "Canguro con Estampado",
        descripcion: "Canguro de algodón suave con capucha y diseño frontal personalizado",
        precio: 280,
        categoria: "canguro",
        tallas: ["M", "L", "XL"],
        contacto: "Ana Jiménez",
        telefono: "72345678",
        email: "ana@ejemplo.com",
        ubicacion: "Santa Cruz, 2do Anillo",
        fechaPublicacion: "2024-01-13",
        imagen: "/api/placeholder/300/300",
        diseno: {
          color: "#6c5ce7",
          stickers: [],
          texts: [{ content: "STYLE", color: "#ffffff" }]
        }
      }
    ];
    setPublicaciones(publicacionesEjemplo);
  }, []);

  const publicacionesFiltradas = publicaciones.filter(pub => {
    const coincideBusqueda = pub.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            pub.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === "todas" || pub.categoria === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  }).sort((a, b) => {
    if (filtroOrden === "recientes") {
      return new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion);
    } else if (filtroOrden === "precio_bajo") {
      return a.precio - b.precio;
    } else if (filtroOrden === "precio_alto") {
      return b.precio - a.precio;
    }
    return 0;
  });

  const handleContactar = (publicacion) => {
    const mensaje = `Hola ${publicacion.contacto}, me interesa tu ${publicacion.titulo}. ¿Podrías darme más información?`;
    const whatsappUrl = `https://wa.me/591${publicacion.telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="publicaciones-wrapper">
      <header className="publicaciones-header">
        <div className="header-content">
          <button onClick={onBack} className="btn-back">
            ← Volver al Diseñador
          </button>
          <h1>🛍️ Publicaciones de Diseños</h1>
          <p>Descubre diseños únicos creados por nuestra comunidad</p>
        </div>
      </header>

      <div className="filtros-container">
        <div className="filtros-row">
          <div className="busqueda-group">
            <input
              type="text"
              placeholder="Buscar diseños..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="busqueda-input"
            />
          </div>

          <div className="filtros-group">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="filtro-select"
            >
              <option value="todas">Todas las categorías</option>
              <option value="polera">Poleras</option>
              <option value="top">Tops</option>
              <option value="canguro">Canguros</option>
              <option value="gorra">Gorras</option>
            </select>

            <select
              value={filtroOrden}
              onChange={(e) => setFiltroOrden(e.target.value)}
              className="filtro-select"
            >
              <option value="recientes">Más recientes</option>
              <option value="precio_bajo">Precio: menor a mayor</option>
              <option value="precio_alto">Precio: mayor a menor</option>
            </select>
          </div>
        </div>
      </div>

      <div className="publicaciones-grid">
        {publicacionesFiltradas.length === 0 ? (
          <div className="no-resultados">
            <p>No se encontraron publicaciones que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          publicacionesFiltradas.map(publicacion => (
            <div key={publicacion.id} className="publicacion-card">
              <div className="card-image">
                <div 
                  className="preview-diseno"
                  style={{ backgroundColor: publicacion.diseno.color }}
                >
                  {publicacion.diseno.texts.map((text, index) => (
                    <span 
                      key={index}
                      style={{ 
                        color: text.color,
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}
                    >
                      {text.content}
                    </span>
                  ))}
                </div>
                <div className="categoria-badge">
                  {publicacion.categoria}
                </div>
              </div>

              <div className="card-content">
                <h3 className="card-title">{publicacion.titulo}</h3>
                <p className="card-description">{publicacion.descripcion}</p>
                
                <div className="card-details">
                  <div className="precio">
                    <strong>Bs. {publicacion.precio}</strong>
                  </div>
                  <div className="tallas">
                    <span>Tallas: </span>
                    {publicacion.tallas.map((talla, index) => (
                      <span key={index} className="talla-tag">
                        {talla}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-info">
                  <div className="contacto-info">
                    <p><strong>Contacto:</strong> {publicacion.contacto}</p>
                    <p><strong>Ubicación:</strong> {publicacion.ubicacion}</p>
                    <p><strong>Publicado:</strong> {new Date(publicacion.fechaPublicacion).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    onClick={() => handleContactar(publicacion)}
                    className="btn-contactar"
                  >
                    💬 Contactar por WhatsApp
                  </button>
                  
                  <div className="contact-options">
                    <a 
                      href={`tel:${publicacion.telefono}`}
                      className="contact-link"
                    >
                      📞 Llamar
                    </a>
                    <a 
                      href={`mailto:${publicacion.email}`}
                      className="contact-link"
                    >
                      ✉️ Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {publicacionesFiltradas.length > 0 && (
        <div className="publicaciones-footer">
          <p>Mostrando {publicacionesFiltradas.length} de {publicaciones.length} publicaciones</p>
        </div>
      )}
    </div>
  );
};

export default Publicaciones;