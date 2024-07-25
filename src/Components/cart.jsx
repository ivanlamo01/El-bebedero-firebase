import { useCart } from "../Context/CartContext";
import { getProductByBarcode, getProductByTitle, updateProductStock, addSale } from "../Services/productosServices";
import { useState, useEffect, useCallback } from "react";
import React from 'react';
import '../styles/cart.css';

function Cart() {
    const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useCart();
    const [barcode, setBarcode] = useState('');
    const [title, setTitle] = useState('');
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleSearchByBarcode = async (event) => {
        event.preventDefault();
        try {
            const product = await getProductByBarcode(barcode);
            if (product) {
                const existingProduct = cart.find(item => item.id === product.id);
                if (existingProduct) {
                    updateCartQuantity(product.id, existingProduct.quantity + 1);
                } else {
                    addToCart({ ...product, quantity: 1 });
                }
                setBarcode('');
            } else {
                alert('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al buscar el producto:', error);
        }
    };

    const handleSearchByTitle = async (event) => {
        event.preventDefault();
        try {
            const product = await getProductByTitle(title);
            if (product) {
                const existingProduct = cart.find(item => item.id === product.id);
                if (existingProduct) {
                    updateCartQuantity(product.id, existingProduct.quantity + 1);
                } else {
                    addToCart({ ...product, quantity: 1 });
                }
                setTitle('');
            } else {
                alert('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al buscar el producto:', error);
        }
    };

    const handleQuantityChange = async (id, newQuantity) => {
        updateCartQuantity(id, newQuantity);
    };

    const handlePurchaseConfirmation = () => {
        console.log("handlePurchaseConfirmation called"); // Verificar si se llama la función
        setShowModal(true);
        console.log("showModal:", showModal); // Verificar el estado del modal
    };

    const confirmPurchase = async () => {
        try {
            for (const item of cart) {
                if (item && item.data && item.data.Barcode) {
                    const product = await getProductByBarcode(item.data.Barcode);
                    if (product) {
                        const newStock = product.data.stock - item.quantity;
                        if (newStock >= 0) {
                            await updateProductStock(product.id, newStock);
                        } else {
                            alert(`No hay suficiente stock para ${product.data.title}`);
                            return;
                        }
                    }
                } else {
                    console.error('Producto inválido en el carrito:', item);
                }
            }

            const sale = {
                total: total,
                products: cart,
                paymentMethod: paymentMethod
            };
            await addSale(sale);
            clearCart();
            alert('Compra confirmada y stock actualizado');
        } catch (error) {
            console.error('Error al confirmar la compra:', error);
        } finally {
            setShowModal(false);
        }
    };

    const calculateTotal = useCallback(() => {
        const total = cart.reduce((acc, item) => acc + item.data.price * item.quantity, 0);
        setTotal(total);
    }, [cart]);

    useEffect(() => {
        calculateTotal();
    }, [cart, calculateTotal]);

    return (
    <>
        <div className="separador">
            <h1>Carrito de Compras</h1>
        </div>
        <div className="cart-container">
            <div className="left-side">
                <form onSubmit={handleSearchByBarcode} className="cart-form">
                    <input 
                        type="text" 
                        value={barcode} 
                        onChange={(e) => setBarcode(e.target.value)} 
                        placeholder="Buscar por código de barras" 
                        className="cart-input"
                    />
                    <button type="submit" className="cart-button">Agregar por código de barras</button>
                </form>
                <form onSubmit={handleSearchByTitle} className="cart-form">
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Buscar por título" 
                        className="cart-input"
                    />
                    <button type="submit" className="cart-button">Agregar por título</button>
                </form>
                <button onClick={clearCart} className="cart-button clear-button">Vaciar Carrito</button>
                {cart.length === 0 ? (
                    <p>El carrito está vacío</p>
                ) : (
                    <div className="cart-table-container">
                        <table className="cart-table">
                            <thead className="cart-table-header">
                                <tr>
                                    <th>Barcode</th>
                                    <th>Título</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.data.Barcode}</td>
                                        <td>{item.data.title}</td>
                                        <td>{item.data.price}</td>
                                        <td>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value={item.quantity} 
                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))} 
                                                className="quantity-input"
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => removeFromCart(item.id)} className="cart-button">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="right-side">
    <h3>Total: ${total.toFixed(2)}</h3>
    <button 
        onClick={handlePurchaseConfirmation} 
        className="cart-button confirm-button"
        disabled={cart.length === 0} // Deshabilitar si el carrito está vacío
    >
        Confirmar Compra
    </button>
    {cart.length === 0 && (
        <p>No puedes confirmar la compra porque el carrito está vacío.</p>
    )}
        </div>
                </div>
                {showModal && (
                <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', width: '300px', textAlign: 'center' }}>
                    <h2>Seleccionar Medio de Pago</h2>
                    <select onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
                        <option value="">Seleccionar</option>
                        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                        <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                        <option value="Efectivo">Efectivo</option>
                    </select>
                    <button onClick={confirmPurchase} className="cart-button confirm-button">Confirmar</button>
                    <button onClick={() => setShowModal(false)} className="cart-button clear-button">Cancelar</button>
                </div>
            </div>
        )}
    </>
);
}

export default Cart;