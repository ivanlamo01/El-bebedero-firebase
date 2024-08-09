import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product, customPrice = null, customDescription = '') => {
        setCart((prevCart) => {
            if (product.data.category === 'Almacen') {
                // Generar un identificador único para cada entrada de producto de "Almacen"
                const uniqueId = uuidv4();
                return [
                    ...prevCart,
                    {
                        ...product,
                        id: `${product.id}-${uniqueId}`,
                        quantity: 1,
                        customPrice: customPrice ? customPrice : product.data.price,
                        customDescription: customDescription ? customDescription : product.data.description,
                    }
                ];
            } else {
                const existingProduct = prevCart.find(item => item.id === product.id);
                if (existingProduct) {
                    return prevCart.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [
                        ...prevCart,
                        {
                            ...product,
                            quantity: 1,
                            customPrice: customPrice ? customPrice : product.data.price,
                            customDescription: customDescription ? customDescription : product.data.description,
                        }
                    ];
                }
            }
        });
    };

    const removeFromCart = (uniqueId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== uniqueId));
    };

    const updateCartQuantity = (id, quantity) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
