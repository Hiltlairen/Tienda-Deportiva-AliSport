//inicio de la pagina 
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const models = [
  { id: "polera", name: "Polera", image: "/polera.webp" },
  { id: "top", name: "Top", image: "/top.webp" },
  { id: "canguro", name: "Canguro", image: "/canguro.webp" },
  { id: "gorra", name: "Gorra", image: "/gorra.webp" },
];

const Home = () => {
  const handleMouseMove = (e, index) => {
    const image = document.getElementById(`img-${index}`);
    const card = image?.parentElement;
    if (!image || !card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = (x - centerX) * 0.05;
    const moveY = (y - centerY) * 0.05;

    image.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
  };

  const handleMouseLeave = (index) => {
    const image = document.getElementById(`img-${index}`);
    if (image) {
      image.style.transform = "translate(0px, 0px) scale(1)";
    }
  };

  return (
    <div className="home-container">
      <div className="text-section">
        <h1>Selecciona un modelo 3D</h1>
        <p className="description">
          Elige una prenda o accesorio para visualizarla en 3D. Personaliza tus productos y obtén una vista previa antes de realizar tu pedido.
        </p>
      </div>
      <div className="models-grid">
        {models.map((model, index) => (
          <Link
            key={model.id}
            to={`/viewer/${model.id}`}
            className="model-card"
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <img id={`img-${index}`} src={model.image} alt={model.name} />
            <p>{model.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
