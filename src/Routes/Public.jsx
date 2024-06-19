import Registro from '../Pages/Registro';
import Login from '../Pages/Login';
import NavBar from '../Components/NavBar';
import DetalleProd from '../Pages/DetalleProd';
import PagDeCompra from '../Pages/PagDeCompra';
import Home from '../Pages/Home'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import ProductosAlta from '../Pages/ProductosAlta';
import ProductosModificar from '../Pages/ProductosModificar';
import AuthProvider from '../Context/AuthContext';
import Footer from "../Components/footer"


function Public() {
    
    return (
    <AuthProvider>
    <div className="App">
            <NavBar />
                <Routes>
                    <Route  path="/" element={<Home/>} />
                    <Route  path="/alta" element={<Registro/>}/>
                    <Route  path="/ingresar" element={<Login/>}/>
                    <Route  path="/detalle/:detalleId" element={<DetalleProd />}/>
                    <Route  path="/detalle/editar/:detalleId" element={<ProductosModificar />}/>
                    <Route  path="/compra" element={<PagDeCompra/>}/>
                    <Route  path="/productos/ProductosAlta" element={<ProductosAlta />}/>
                </Routes>
            <Footer/>
    </div>
    </AuthProvider>
    );
}

export default Public;