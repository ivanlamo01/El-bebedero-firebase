import { Link, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuthContext } from '../Context/AuthContext';
import Container from 'react-bootstrap/Container';

const style = {
    header: {
        fontWeight: "400",
        fontSize: "10px",
    },
    links: {
        width:"250px",
        paddingTop: "50px",
        fontSize: "20px",
        color: "#818181",
        display: "flex",
        flexDirection: "column",
        whiteSpace:"nowrap",
        
    },
    brand: {
        color: "#fff",
        textDecoration: "none",
        fontSize: "24px",
        display: "flex",
        alignItems: "flex-start",
        borderBottom: "1px solid #444",
    },
    navLink: {
        width:"100%",
        display: "flex",
        borderRadius: "12px",
        transition: "background-color 0.3s, color 0.3s",
        alignItems: "center",
        padding:"5px",
        margin:"1px",
        
    },
    navLinkActive: {
        backgroundColor: "rgba(33,33,33,255)",
        color: "#fff",
        boxShadow: "0 4px 8px black",
    },
};

const NavBar = () => {
    const { login, handleLogout } = useAuthContext();
    const location = useLocation();

    return (
        <header style={style.header}>
            <Navbar
                collapseOnSelect
                expand="lg"
                variant="dark"
                style={{
                    height: "100%",
                    width: "17%",
                    position: "fixed",
                    zIndex: "1",
                    top: "0",
                    left: "0",
                    backgroundColor: "rgba(18,18,18,255)",
                    overflowX: "hidden",
                    overflowY: "auto",
                    transition: "width 0.5s",
                    backdropFilter: "blur(10px)",
                    flexWrap: "wrap"
                }}
            >
                <Container style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Navbar.Brand as={Link} to="/" style={style.brand}>
                        El Bebedero
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" style={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}>
                        <Nav style={style.links} className='links'>
                            <Nav.Link
                                as={Link}
                                to="/"
                                style={{
                                    ...style.navLink,
                                    ...(location.pathname === "/" ? style.navLinkActive : {}),
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = style.navLinkActive.backgroundColor;
                                    e.currentTarget.style.color = style.navLinkActive.color;
                                }}
                                onMouseLeave={e => {
                                    if (location.pathname !== "/") {
                                        e.currentTarget.style.backgroundColor = "";
                                        e.currentTarget.style.color = "";
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" />
                                    <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" />
                                </svg>
                                <span style={{paddingLeft:"10px"}}>Home</span>
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/inventario"
                                style={{
                                    ...style.navLink,
                                    ...(location.pathname === "/inventario" ? style.navLinkActive : {}),
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = style.navLinkActive.backgroundColor;
                                    e.currentTarget.style.color = style.navLinkActive.color;
                                }}
                                onMouseLeave={e => {
                                    if (location.pathname !== "/inventario") {
                                        e.currentTarget.style.backgroundColor = "";
                                        e.currentTarget.style.color = "";
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" />
                                    <path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z" />
                                </svg>
                                <span style={{paddingLeft:"10px"}}>  Inventario</span>
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/cart"
                                style={{
                                    ...style.navLink,
                                    ...(location.pathname === "/cart" ? style.navLinkActive : {}),
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = style.navLinkActive.backgroundColor;
                                    e.currentTarget.style.color = style.navLinkActive.color;
                                }}
                                onMouseLeave={e => {
                                    if (location.pathname !== "/cart") {
                                        e.currentTarget.style.backgroundColor = "";
                                        e.currentTarget.style.color = "";
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="10" cy="20.5" r="1" />
                                    <circle cx="18" cy="20.5" r="1" />
                                    <path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1" />
                                </svg>
                                <span style={{paddingLeft:"10px"}}>Iniciar Venta</span>
                            </Nav.Link>
                            {login && (
                                <>
                                    <Nav.Link
                                        as={Link}
                                        to="/inventario/ProductosAlta"
                                        style={{
                                            ...style.navLink,
                                            ...(location.pathname === "/inventario/ProductosAlta" ? style.navLinkActive : {}),
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.backgroundColor = style.navLinkActive.backgroundColor;
                                            e.currentTarget.style.color = style.navLinkActive.color;
                                        }}
                                        onMouseLeave={e => {
                                            if (location.pathname !== "/inventario/ProductosAlta") {
                                                e.currentTarget.style.backgroundColor = "";
                                                e.currentTarget.style.color = "";
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 21H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h5l2 3h9a2 2 0 0 1 2 2v2M19 15v6M16 18h6" />
                                        </svg>
                                        <span style={{paddingLeft:"10px"}}>Añadir Prod</span>
                                    </Nav.Link>
                                </>
                            )}
                            {login && (
                                <>
                                    <Nav.Link
                                        as={Link}
                                        to="/debtors"
                                        style={{
                                            ...style.navLink,
                                            ...(location.pathname === "/debtors" ? style.navLinkActive : {}),
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.backgroundColor = style.navLinkActive.backgroundColor;
                                            e.currentTarget.style.color = style.navLinkActive.color;
                                        }}
                                        onMouseLeave={e => {
                                            if (location.pathname !== "/debtors") {
                                                e.currentTarget.style.backgroundColor = "";
                                                e.currentTarget.style.color = "";
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                                            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                                        </svg>
                                        <span style={{paddingLeft:"10px"}}>Deudores</span>
                                    </Nav.Link>
                                </>
                            )}
                            {login && (
                                <>
                                    <Nav.Link
                                        as={Link}
                                        to="/sales"
                                        style={{
                                            ...style.navLink,
                                            ...(location.pathname === "/sales" ? style.navLinkActive : {}),
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.backgroundColor = style.navLinkActive.backgroundColor;
                                            e.currentTarget.style.color = style.navLinkActive.color;
                                        }}
                                        onMouseLeave={e => {
                                            if (location.pathname !== "/sales") {
                                                e.currentTarget.style.backgroundColor = "";
                                                e.currentTarget.style.color = "";
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" />
                                            <path d="M15 7h6v6" />
                                        </svg>
                                        <span style={{paddingLeft:"10px"}}>Ventas</span>
                                    </Nav.Link>
                                </>
                            )}
                            {!login && (
                                <>
                                    <Nav.Link
                                        as={Link}
                                        to="/alta"
                                        style={{
                                            ...style.navLink,
                                            ...(location.pathname === "/alta" ? style.navLinkActive : {}),
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.backgroundColor = style.navLinkActive.backgroundColor;
                                            e.currentTarget.style.color = style.navLinkActive.color;
                                        }}
                                        onMouseLeave={e => {
                                            if (location.pathname !== "/alta") {
                                                e.currentTarget.style.backgroundColor = "";
                                                e.currentTarget.style.color = "";
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="8.5" cy="7" r="4" />
                                            <line x1="20" y1="8" x2="20" y2="14" />
                                            <line x1="23" y1="11" x2="17" y2="11" />
                                        </svg>
                                        <span style={{paddingLeft:"10px"}}>Registro</span>
                                    </Nav.Link>
                                </>
                            )}
                            {!login && (
                                <>
                                    <Nav.Link
                                        as={Link}
                                        to="/ingresar"
                                        style={{
                                            ...style.navLink,
                                            ...(location.pathname === "/ingresar" ? style.navLinkActive : {}),
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.backgroundColor = style.navLinkActive.backgroundColor;
                                            e.currentTarget.style.color = style.navLinkActive.color;
                                        }}
                                        onMouseLeave={e => {
                                            if (location.pathname !== "/ingresar") {
                                                e.currentTarget.style.backgroundColor = "";
                                                e.currentTarget.style.color = "";
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="8.5" cy="7" r="4" />
                                            <polyline points="17 11 19 13 23 9" />
                                        </svg>
                                        <span style={{paddingLeft:"10px"}}>Log In</span>
                                    </Nav.Link>
                                </>
                            )}
                            {login && (
                                <div>
                                    <Nav.Link
                                        onClick={handleLogout}
                                        style={style.navLink}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.backgroundColor = style.navLinkActive.backgroundColor;
                                            e.currentTarget.style.color = style.navLinkActive.color;
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.backgroundColor = "";
                                            e.currentTarget.style.color = "";
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="8.5" cy="7" r="4" />
                                            <line x1="18" y1="8" x2="23" y2="13" />
                                            <line x1="23" y1="8" x2="18" y2="13" />
                                        </svg>
                                        <span style={{paddingLeft:"10px"}}>Salir</span>
                                    </Nav.Link>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default NavBar;
