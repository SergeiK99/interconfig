import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5115/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// Add interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token); // Debug token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Request headers:', config.headers); // Debug headers
    } else {
        console.warn('No token found in localStorage'); // Debug missing token
    }
    return config;
});

export const cartService = {
    getCart: async () => {
        try {
            const response = await api.get('/cart');
            return response.data;
        } catch (error) {
            console.error('Error getting cart:', error);
            throw error;
        }
    },

    addToCart: async (deviceId, quantity) => {
        try {
            console.log('Adding to cart:', { deviceId, quantity }); // Debug request data
            const response = await api.post('/cart/items', {
                deviceId: parseInt(deviceId),
                quantity: parseInt(quantity)
            });
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    updateCartItem: async (itemId, quantity) => {
        try {
            const response = await api.put(`/cart/items/${itemId}`, {
                quantity: parseInt(quantity)
            });
            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },

    removeFromCart: async (itemId) => {
        try {
            await api.delete(`/cart/items/${itemId}`);
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    clearCart: async () => {
        try {
            await api.delete('/cart');
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
}; 