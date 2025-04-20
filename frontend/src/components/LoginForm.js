import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import '../styles/Auth.css';

const LoginForm = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await authService.login(email, password);
            login(response);
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-header">
                <h2>Вход</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Войти</button>
            </form>
        </div>
    );
};

export default LoginForm; 