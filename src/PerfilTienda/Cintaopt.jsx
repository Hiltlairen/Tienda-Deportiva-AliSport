import React from 'react';
import './style/Cintaopt.css';

const Cintaopt = ({ onSelectOption }) => {
  return (
    <div className="option-tape-container">
      <div className="option-tape">
        <button onClick={() => onSelectOption(1)}>Publicar Producto</button>
        <button onClick={() => onSelectOption(2)}>Editar Perfil</button>
        <button onClick={() => onSelectOption(3)}>Opción 3</button>
      </div>
    </div>
  );
};

export default Cintaopt;