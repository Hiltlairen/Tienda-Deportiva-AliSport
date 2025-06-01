import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import './OfertaPersonalizada.css';

function ModeloOBJ() {
  const objRef = useRef();
  const obj = useLoader(OBJLoader, '/polera.obj');

  // Animación: rotación constante sobre el eje Y
  useFrame(() => {
    if (objRef.current) {
      objRef.current.rotation.y += 0.01;
    }
  });

  return (
    <primitive
      object={obj}
      ref={objRef}
      scale={0.08}              // Escala ajustada
      position={[0, -2.6, 0]}  // Baja el modelo si está flotando
    />
  );
}

function OfertaPersonalizada() {
  return (
    <div className="oferta-dividida-container">
      {/* Sección izquierda (Modelo 3D) */}
      <div className="oferta-imagen">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <ModeloOBJ />
          </Suspense>
          <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Sección derecha (Texto y botones) */}
      <div className="oferta-contenido">
        <h2>¡DISEÑALO TU MISMO!</h2>
        
        <div className="oferta-botones">
        <a
  href="https://lightskyblue-seal-447089.hostingersite.com/"
  className="boton-outlined"
  target="_blank"
  rel="noopener noreferrer"
>
  YA NO MÁS
</a>

         
        </div>
      </div>
    </div>
  );
}

export default OfertaPersonalizada;
