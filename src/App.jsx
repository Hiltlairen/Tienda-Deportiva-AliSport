import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
// Componentes Globales
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
//LOGIN aaaa
import Login from './Login/Login/Login';
import Register from './Login/Register/Register';
import SellerRegister from './Login/SellerRegister/SellerRegister';
import SellerLogin from './Login/SellerLogin/SellerLogin';
import EstadisticasPopulares from './components/EstadisticasPopulares/EstadisticasPopulares';
// Páginas Públicas PERFIL
import ProfilePage from './Perfil/ProfilePage';
import ViewProduct from './Productos/Product/ViewProduct';
import ResumenPedido from './Productos/resumen/ResumenPedido';
import Reportes from './PerfilTienda/Reportes';

//VENDEDOR
import Dashboard from './PerfilTienda/Dashboard';
import RegistrarTienda from './Login/RegistrarTienda/RegistrarTienda';
///PUBLIC
import Inicio from './PaginaPrincipal/Inicio/Inicio';
//import NotFound from './pages/NotFound';

//Editar datos
import EditarPerfil from './components/EditPerfil/EditarPerfil';

import StoreLink from './components/StoreLink/StoreLink';
import TiendaPage from './Perfil/TiendaPage';



function App() {
  return (
    <BrowserRouter>
      {/* Header visible en todas las páginas */}
      <Header />
      
      <main className="main-content">
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<Inicio />} />
          <Route path="/producto/:id" element={<ViewProduct />} />
          <Route path="/resumen-pedido" element={<ResumenPedido />} />
          <Route path="/estadisticas-populares" element={<EstadisticasPopulares />} />

          <Route path="/reportes" element={<Reportes />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/seller-register" element={<SellerRegister />} />
          
          {/* VENDEDOR*/}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registrar-tienda" element={<RegistrarTienda />} />
          {/*Perfil */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/editaruser" element={<EditarPerfil />} />

           <Route path="/tienda/:id" element={<TiendaPage />} />
          {/* Ruta 404 */}
          {/*<Route path="*" element={<NotFound />} />*/}
        </Routes>
      </main>

      {/* Footer visible en todas las páginas */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;