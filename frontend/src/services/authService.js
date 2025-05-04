const API_URL = process.env.REACT_APP_API_BASE_URL;

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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Неверный email или пароль');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при регистрации');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    }
}; 