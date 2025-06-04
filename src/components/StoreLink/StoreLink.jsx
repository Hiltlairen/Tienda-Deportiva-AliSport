import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StoreLink.css';

function StoreLink({ storeId, storeName, className = '' }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (storeId) {
      sessionStorage.setItem('current_store_id', storeId);
      navigate(`/tienda/${storeId}`);
    }
  };

  return (
    <span 
      className={`store-link ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
    >
      {storeName || `Tienda ${storeId}`}
    </span>
  );
}

export default StoreLink;