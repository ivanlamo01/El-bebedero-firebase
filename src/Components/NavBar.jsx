import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../Context/AuthContext';
import '../styles/navBar.css';
import img from "../Assets/img/logobebedero.png"

const NavBar = () => {
    const { login, handleLogout } = useAuthContext();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <header className="header">
            <button className="navbar-toggle" onClick={toggleSidebar}>
                &#9776; {/* Símbolo de hamburguesa */}
            </button>
            <div className={`navbar-custom ${isSidebarOpen ? 'active' : ''}`}>
                <Link to="/" className="brand" onClick={toggleSidebar}>
                    <img src={img} alt=""  width={"40px"} />
                <span>
                    El Bebedero
                </span>
                    
                </Link>
                <div className="links">
                    <Link
                        to="/"
                        className={`navlink ${location.pathname === "/" ? "navlink-active" : ""}`}
                        onClick={toggleSidebar}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" />
                            <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" />
                        </svg>
                        <span>Home</span>
                    </Link>
                    <Link
                        to="/inventario"
                        className={`navlink ${location.pathname === "/inventario" ? "navlink-active" : ""}`}
                        onClick={toggleSidebar}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" />
                            <path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z" />
                        </svg>
                        <span>Inventario</span>
                    </Link>
                    <Link
                        to="/cart"
                        className={`navlink ${location.pathname === "/cart" ? "navlink-active" : ""}`}
                        onClick={toggleSidebar}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="10" cy="20.5" r="1" />
                            <circle cx="18" cy="20.5" r="1" />
                            <path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1" />
                        </svg>
                        <span>Iniciar Venta</span>
                    </Link>
                    {login && (
                        <Link
                            to="/inventario/ProductosAlta"
                            className={`navlink ${location.pathname === "/inventario/ProductosAlta" ? "navlink-active" : ""}`}
                            onClick={toggleSidebar}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 21H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h5l2 3h9a2 2 0 0 1 2 2v2M19 15v6M16 18h6" />
                            </svg>
                            <span>Añadir Prod</span>
                        </Link>
                    )}
                    {login && (
                        <Link
                            to="/debtors"
                            className={`navlink ${location.pathname === "/debtors" ? "navlink-active" : ""}`}
                            onClick={toggleSidebar}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                            </svg>
                            <span>Deudores</span>
                        </Link>
                    )}
                    {login && (
                        <Link
                            to="/sales"
                            className={`navlink ${location.pathname === "/sales" ? "navlink-active" : ""}`}
                            onClick={toggleSidebar}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" />
                                <path d="M15 7h6v6" />
                            </svg>
                            <span>Ventas</span>
                        </Link>
                    )}
                    {!login && (
                        <Link
                            to="/alta"
                            className={`navlink ${location.pathname === "/alta" ? "navlink-active" : ""}`}
                            style={{marginTop:"100%"}}
                            onClick={toggleSidebar}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="20" y1="8" x2="20" y2="14" />
                                <line x1="23" y1="11" x2="17" y2="11" />
                            </svg>
                            <span>Registro</span>
                        </Link>
                    )}
                    {!login && (
                        <Link
                            to="/ingresar"
                            className={`navlink ${location.pathname === "/ingresar" ? "navlink-active" : ""}`}
                            onClick={toggleSidebar}


                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <polyline points="17 11 19 13 23 9" />
                            </svg>
                            <span>Log In</span>
                        </Link>
                    )}
                    {login && (
                        <div
                            className="navlink"
                            style={{marginTop:"85%"}}
                            onClick={handleLogout}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="18" y1="8" x2="23" y2="13" />
                                <line x1="23" y1="8" x2="18" y2="13" />
                            </svg>
                            <span>Salir</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default NavBar;
