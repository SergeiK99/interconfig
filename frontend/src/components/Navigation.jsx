import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Navigation = () => {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <header className="app-header">
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Конфигуратор</Link></li>
          <li><Link to="/catalog">Каталог устройств</Link></li>
          <li><Link to="/ai-consultant">ИИ-консультант</Link></li>
        </ul>
        
        <div className="auth-buttons">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button onClick={logout} className="logout-button">Выйти</button>
            </>
          ) : (
            <>
              <button className="auth-button" onClick={() => setShowLoginModal(true)}>Войти</button>
              <button className="auth-button" onClick={() => setShowRegisterModal(true)}>Регистрация</button>
            </>
          )}
        </div>
      </nav>
      
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <LoginForm onClose={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
      
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RegisterForm onClose={() => setShowRegisterModal(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation; 