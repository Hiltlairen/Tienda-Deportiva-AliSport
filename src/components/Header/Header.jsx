import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { getUserData } from '../../services/back';

function Header() {
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const id_usuario = sessionStorage.getItem('id_usuario');
      
      if (id_usuario) {
        try {
          const response = await getUserData(id_usuario);
          if (response.success) {
            setUserName(response.nombre);
            setUserRole(response.rol);
            // Guardamos en localStorage para persistencia entre recargas
            localStorage.setItem('userName', response.nombre);
            localStorage.setItem('userRole', response.rol);
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
        }
      } else {
        // Limpiar si no hay usuario
        setUserName(null);
        setUserRole(null);
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    // Verificar usuario al montar el componente
    checkUser();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const cerrarSesion = () => {
    sessionStorage.removeItem('id_usuario');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    fetch('http://localhost/back-ropa/estado/logout.php', { method: 'POST' });
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
    navigate(userRole === 'vendedor' ? '/dashboard' : '/profile');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">ALISPORT</Link>
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <a
          href="https://mousetech.vercel.app/"
          className="nav-button"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          NOSOTROS
        </a>
        <div className="button-group">
          {userName ? (
            <>
              <button onClick={handleProfileClick} className="nav-button">
                Hola, {userName}
              </button>
              <button onClick={cerrarSesion} className="nav-button outlined">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-button outlined" onClick={() => isMobile && setIsMenuOpen(false)}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;