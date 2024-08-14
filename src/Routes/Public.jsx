import Registro from '../Pages/Registro';
import Inventario from '../Pages/Inventario';
import Login from '../Pages/Login';
import NavBar from '../Components/NavBar';
import DetalleProd from '../Pages/DetalleProd';
import Home from '../Pages/Home'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import ProductosAlta from '../Pages/ProductosAlta';
import ProductosModificar from '../Pages/ProductosModificar';
import AuthProvider from '../Context/AuthContext';
import Footer from "../Components/footer"
import { CartProvider } from '../Context/CartContext';
import Cart from '../Components/cart';
import DebtorsList from '../Pages/DebtorList';
import SalesList from '../Pages/SalesList';
import ExpensesTable from '../Pages/expensesTable';


function Public() {
    
    return (
    <AuthProvider>
        <CartProvider>
    <div className="App">
            <NavBar />
            <div className='main'>
            <Routes>
                    <Route  path="/" element={<Home/>} />
                    <Route  path="/inventario" element={<Inventario/>} />
                    <Route  path="/cart" element={<Cart/>} />
                    <Route  path="/sales" element={<SalesList/>} />
                    <Route  path="/expenses" element={<ExpensesTable/>} />
                    <Route path="/debtors" element={<DebtorsList/>} />
                    <Route  path="/alta" element={<Registro/>}/>
                    <Route  path="/ingresar" element={<Login/>}/>
                    <Route  path="/detalle/:detalleId" element={<DetalleProd />}/>
                    <Route  path="/detalle/editar/:detalleId" element={<ProductosModificar />}/>
                    <Route  path="/inventario/ProductosAlta" element={<ProductosAlta />}/>
                </Routes>
            </div>

            <Footer/>
    </div>
    </CartProvider>
    </AuthProvider>
    );
}

export default Public;