import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCart(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await cartService.getCart();
            console.log('Received cart data from backend:', data);
            setCart(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError(err.message);
            if (err.response?.status === 401) {
                // Token might be expired or invalid
                localStorage.removeItem('token');
                setCart(null);
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (deviceId, quantity) => {
        if (!user) {
            throw new Error('User must be logged in to add items to cart');
        }

        try {
            setLoading(true);
            const data = await cartService.addToCart(parseInt(deviceId), parseInt(quantity));
            setCart(data);
            setError(null);
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError(err.message);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setCart(null);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        if (!user) {
            throw new Error('User must be logged in to update cart');
        }

        try {
            setLoading(true);
            const data = await cartService.updateCartItem(parseInt(itemId), parseInt(quantity));
            setCart(data);
            setError(null);
        } catch (err) {
            console.error('Error updating cart item:', err);
            setError(err.message);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setCart(null);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId) => {
        if (!user) {
            throw new Error('User must be logged in to remove items from cart');
        }

        try {
            setLoading(true);
            await cartService.removeFromCart(parseInt(itemId));
            await fetchCart();
            setError(null);
        } catch (err) {
            console.error('Error removing from cart:', err);
            setError(err.message);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setCart(null);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        if (!user) {
            throw new Error('User must be logged in to clear cart');
        }

        try {
            setLoading(true);
            await cartService.clearCart();
            setCart(null);
            setError(null);
        } catch (err) {
            console.error('Error clearing cart:', err);
            setError(err.message);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setCart(null);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}; 