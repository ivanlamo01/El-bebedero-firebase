import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuthContext } from '../Context/AuthContext';
import Container from 'react-bootstrap/Container';

const style={
    header:{
        width:"100%",
        fontWeight: "700",
        fontSize:"20px",
        display:"flex",
    },

}

function NavBar(){
    const {login,handleLogout,user} = useAuthContext()
    const navIcon= (
        <svg width="25px" height="25px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000"><ellipse cx="32" cy="24" rx="12" ry="16"/><path d="M22 33.46s-10.09 2.68-12 8A33 33 0 0 0 8 56h48a33 33 0 0 0-1.94-14.54c-1.93-5.32-12-8-12-8"/></svg>
    )

    return (
        <>  
            <header style={style.header} >

            <Navbar  collapseOnSelect expand="lg"  variant="dark"  
                    style={{backgroundColor: isScrolled? "#202d56":"#FFFFFF00",
                            position:"fixed",
                            top: "0px",
                            display:"flex",
                            width:"100%",
                            zIndex:"99",
                            }}>
                
                <Container>
                    <Navbar.Brand as={Link} to="/" style={style.text}>Camisetas La Plata</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto" >
                        <Nav.Link as={Link} to="/" >Home</Nav.Link>
                        <Nav.Link as={Link} to="/inventario" >Inventario</Nav.Link>
                        <Nav.Link as={Link} to="/venta" >Iniciar Venta</Nav.Link>
                            {login &&(
                                <>
                                    <Nav.Link as={Link} to="/productos/ProductosAlta">Agregar Producto</Nav.Link>
                                </>
                            )}  
                                {login &&(
                                <>
                                    <Nav.Link as={Link} to="/cart">Iniciar Compra</Nav.Link>
                                </>
                            )} 
                            {login &&(
                                <>
                                    <Nav.Link as={Link} to="/debtors"> Deudores</Nav.Link>
                                </>
                            )} 
                            {login &&(
                                <>
                                    <Nav.Link as={Link} to="/sales"> Ventas</Nav.Link>
                                </>
                            )} 
                        </Nav>
                        <Nav>                    
                            {!login &&(
                                <>
                                    <NavDropdown title={navIcon}  id="basic-nav-dropdown" style={{color:"#fafafa"}}>
                                        <NavDropdown.Item as={Link} to="/alta" >Registrarse</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/ingresar" >LogIn</NavDropdown.Item>
                                    </NavDropdown>
                                </> )}  
                                {login && <div>     
                                            <NavDropdown title= {user.nombre} id="basic-nav-dropdown" style={{color:"#fafafa"}}>
                                                <NavDropdown.Item  onClick={()=>handleLogout()} >Salir </NavDropdown.Item>
                                            </NavDropdown>
                                        </div>}
                        </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
            </header>
        </>
    );

}


export default NavBar;

