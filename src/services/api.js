export const fetchUserData = async () => {
    const response = await fetch('http://localhost/back-ropa/get_user_data.php', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('No se pudo obtener los datos del usuario');
    }
    
    return await response.json();
  };