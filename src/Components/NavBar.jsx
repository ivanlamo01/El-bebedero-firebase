import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuthContext } from '../Context/AuthContext';
import Container from 'react-bootstrap/Container';
import "../styles/nav.css"
import { useState } from 'react';

const style = {
    header: {
        fontWeight: "400",
        fontSize: "10px",
    },
    links: {
        padding: " 8px 8px 32px",
        textDecoration: "none",
        fontSize: "20px",
        color: "#818181",
        display: "flex",
        flexDirection:"Column",
        justifyContent:"center",
        transition: "0.3s"
    },
}

const NavBar = () => {
    const { login, handleLogout, user } = useAuthContext();
    const navIcon = (
        <svg width="25px" height="25px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000"><ellipse cx="32" cy="24" rx="12" ry="16"/><path d="M22 33.46s-10.09 2.68-12 8A33 33 0 0 0 8 56h48a33 33 0 0 0-1.94-14.54c-1.93-5.32-12-8-12-8"/></svg>
    );
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    return (
        <>
            <header style={style.header}>
                <Navbar
                    collapseOnSelect
                    expand="lg"
                    variant="dark"
                    onMouseEnter={toggleHover}
                    onMouseLeave={toggleHover}
                    style={{
                        height: "100%",
                        width: hovered ? "18%" : "6%",
                        position: "fixed",
                        zIndex: "1",
                        top: "0",
                        left: "0",
                        backgroundColor: "#111",
                        overflowX: "hidden",
                        overflowY: "hidden",
                        paddingTop: "60px",
                        transition: "0.5s",
                    }}
                >
                    <Container>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav style={style.links} className='links'>
                                <Navbar.Brand as={Link} to="/" style={hovered ? {} : { display: 'none' }}>El Bebedero</Navbar.Brand>
                                <Nav.Link as={Link} to="/" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/></svg>
                                    <span style={hovered ? {padding:"10px"} : { display: 'none' }}>Home</span>
                                </Nav.Link>
                                <Nav.Link as={Link} to="/inventario" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5"/><path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z"/></svg>
                                    <span style={hovered ? {padding:"10px"} : { display: 'none' }}>Inventario</span>
                                </Nav.Link>
                                <Nav.Link as={Link} to="/cart" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="20.5" r="1"/><circle cx="18" cy="20.5" r="1"/><path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1"/>
                                </svg>
                                    <span style={hovered ? {padding:"10px"} : { display: 'none' }}>Iniciar Venta</span>
                                </Nav.Link>
                                {login && (
                                    <>
                                        <Nav.Link as={Link} to="/productos/ProductosAlta">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h5l2 3h9a2 2 0 0 1 2 2v2M19 15v6M16 18h6"/></svg>
                                            <span style={hovered ? {padding:"10px"} : { display: 'none' }}>Añadir Prod</span>
                                        </Nav.Link>
                                    </>
                                )}
                                {login && (
                                    <>
                                        <Nav.Link as={Link} to="/debtors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                                            <span style={hovered ? {padding:"10px"} : { display: 'none' }}>Deudores</span>
                                        </Nav.Link>
                                    </>
                                )}
                                {login && (
                                    <>
                                        <Nav.Link as={Link} to="/sales">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7"/><path d="M15 7h6v6"/></svg>
                                        <span style={hovered ? {padding:"10px"} : { display: 'none' }}>Ventas</span>
                                        </Nav.Link>
                                    </>
                                )}
                            
                                    {!login && (
                                        <>
                                                <Nav.Link as={Link} to="/alta" >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                                                <span style={hovered ? {padding:"10px"} : { display: 'none' }}>Registro</span>
                                                </Nav.Link>
                                        </>
                                    )}
                                    {!login && (
                                        <>
                                                <Nav.Link as={Link} to="/ingresar" >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                                                <span style={hovered ? {padding:"10px"} : { display: 'none' }}>Log In</span>
                                                </Nav.Link>
                                        </>
                                    )}
                                    {login && <div>
                                            <Nav.Link onClick={() => handleLogout()} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>
                                            <span style={hovered ? {padding:"10px"} : { display: 'none' }}>Salir</span>
                                            </Nav.Link>
                                        
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