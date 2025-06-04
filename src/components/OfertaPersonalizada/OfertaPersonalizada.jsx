import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OfertaPersonalizada.css';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Suspense, useRef } from 'react';

function ModeloOBJ() {
  const objRef = useRef();
  const obj = useLoader(OBJLoader, '/polera.obj');

  useFrame(() => {
    if (objRef.current) {
      objRef.current.rotation.y += 0.01;
    }
  });

  return (
    <primitive
      object={obj}
      ref={objRef}
      scale={0.08}
      position={[0, -2.6, 0]}
    />
  );
}

function OfertaPersonalizada() {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');

  const manejarClick = () => {
    const usuario = sessionStorage.getItem('usuario');

    if (usuario) {
      // Usuario registrado, redirigir
      navigate('/personalizar');
    } else {
      // Usuario no registrado, mostrar mensaje
      setMensaje('Debes estar registrada para personalizar una prenda. ¡Inicia sesión o regístrate primero!');
      setTimeout(() => {
        setMensaje('');
      }, 5000); // Limpia el mensaje después de 5 segundos
    }
  };

  return (
    <div className="oferta-dividida-container">
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

      <div className="oferta-contenido">
        <h2>¡DISEÑALO TU MISMO!</h2>
        <p className="texto-descripcion">
          Crea tu propia prenda única y refleja tu estilo. Elige colores, añade tu logo o texto, y visualiza el resultado en tiempo real.
        </p>
        <div className="oferta-botones">
          <button onClick={manejarClick} className="boton-outlined">
            Personalizar Ahora
          </button>
        </div>
        {mensaje && <div className="mensaje-registro">{mensaje}</div>}
      </div>
    </div>
  );
}

export default OfertaPersonalizada;
