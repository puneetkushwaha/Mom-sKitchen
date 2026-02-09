import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart')) || []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = async (product, quantity = 1, customizations = []) => {
        // Preventive check
        try {
            const { data } = await API.get('/public/settings');
            if (data.isHolidayMode) {
                alert('Kitchen is currently CLOSED. We are not accepting orders right now.');
                return;
            }
        } catch (e) {
            console.error('Settings fetch failed', e);
        }

        setCartItems(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity, customizations }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
    };

    const clearCart = () => setCartItems([]);
    const replaceCart = (items) => setCartItems(items);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, replaceCart, subtotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
