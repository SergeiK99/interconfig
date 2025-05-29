import React, { useState } from 'react';
import { authService } from '../services/authService';
import '../styles/Auth.css';

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            await authService.register(email, password);
            alert('Регистрация успешна! Теперь войдите.');
            onSwitchToLogin();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-header">
                <h2>Регистрация</h2>
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
                <div className="form-group">
                    <label htmlFor="confirmPassword">Подтвердите пароль:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Зарегистрироваться</button>
                <div className="auth-switch-link">
                    Уже есть аккаунт? <span onClick={onSwitchToLogin}>Войдите</span>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm; 