
import { useCart } from "../Context/CartContext";
import { getProductByBarcode, getProductByTitle,updateProductStock,updateDoc } from "../Services/productosServices"; // Asumiendo que tienes estos servicios
import { useState,useEffect,useCallback} from "react";
import React from 'react';
import '../styles/cart.css'; // Asegúrate de tener este archivo para los estilos


function Cart() {
    const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useCart();
    const [barcode, setBarcode] = useState('');
    const [title, setTitle] = useState('');
    const [total, setTotal] = useState(0);

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

    const handlePurchaseConfirmation = async () => {
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
            clearCart();
            alert('Compra confirmada y stock actualizado');
        } catch (error) {
            console.error('Error al confirmar la compra:', error);
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
        <div className="cart-container">
            <h2>Carrito de Compras</h2>
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
            <h3>Total: ${total.toFixed(2)}</h3>
            {cart.length === 0 ? (
                <p>El carrito está vacío</p>
            ) : (
                <>
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
                    <button onClick={handlePurchaseConfirmation} className="cart-button confirm-button">Confirmar Compra</button>
                </>
            )}
        </div>
    );
}

export default Cart;