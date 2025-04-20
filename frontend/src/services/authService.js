const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5115/api';

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка при входе');
            }

            return response.json();
        } catch (error) {
            console.error('Ошибка при входе:', error);
            throw error;
        }
    },

    async register(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка при регистрации');
            }

            return response.json();
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            throw error;
        }
    },
}; 