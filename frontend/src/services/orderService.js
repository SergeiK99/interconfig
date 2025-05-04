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
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const orderService = {
    createOrder: async (orderData) => {
        try {
            const response = await api.post('/order', orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    getOrder: async (orderId) => {
        try {
            const response = await api.get(`/order/${parseInt(orderId)}`);
            return response.data;
        } catch (error) {
            console.error('Error getting order:', error);
            throw error;
        }
    },

    getUserOrders: async () => {
        try {
            const response = await api.get('/order');
            return response.data;
        } catch (error) {
            console.error('Error getting user orders:', error);
            throw error;
        }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await api.put(`/order/${parseInt(orderId)}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
}; 