// src/services/authService.js

import axios from 'axios';

export async function registerUser(userData) {
  return axios.post(
    'http://localhost/back-ropa/l0gin_vende_cli/registrar_usuario.php',
    userData, 
    { headers: { 'Content-Type': 'application/json' } }
  );
}

export async function loginUser(credentials, isSeller = false) {
  const endpoint = isSeller
    ? 'http://localhost/back-ropa/seller-login.php'
    : 'http://localhost/back-ropa/l0gin_vende_cli/login_usuario.php';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  return response.json();
}
