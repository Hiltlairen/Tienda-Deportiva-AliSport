//los modelos que se veran 
import React from "react";
import { useParams } from "react-router-dom";
import Model3D from "../componentes/Model3D";
import "./Viewer.css";

const models = {
  polera: "/polera.glb",
  top: "/top.glb",
  canguro: "/canguro.glb",
  gorra: "/gorra.glb",
};

const Viewer = () => {
  const { modelId } = useParams();
  const modelPath = models[modelId];

  if (!modelPath) {
    return <h2>Modelo no encontrado</h2>;
  }

  return (
    <div className="viewer-container">
      <Model3D modelPath={modelPath} />
    </div>
  );
};

export default Viewer;
