import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { FaShoppingCart, FaBox } from 'react-icons/fa';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <header className="app-header">
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Конфигуратор</Link></li>
          <li><Link to="/ai-consultant">ИИ-консультант</Link></li>
          <li><Link to="/catalog">Каталог устройств</Link></li>
        </ul>
        
        {/* Меню справочников для админа */}
        {user && user.role === 'Admin' && (
          <ul className="nav-links">
            <li className="dropdown">
              <button className="dropbtn">Справочники</button>
              <div className="dropdown-content">
                <Link to="/admin/roomtypes">Типы помещений</Link>
                <Link to="/admin/devicetypes">Типы устройств</Link>
                <Link to="/admin/possiblecharacteristics">Возможные характеристики</Link>
                {/* Ссылку на характеристики устройств, возможно, лучше сделать в рамках редактирования устройства */}
                {/* <Link to="/admin/characteristics">Характеристики</Link> */}
              </div>
            </li>
          </ul>
        )}

        <div className="auth-buttons">
          {user ? (
            <>
              <Link to="/cart" className="cart-link">
                <FaShoppingCart size={20} />
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>
              <Link to="/orders" className="orders-link">
                <FaBox size={20} />
              </Link>
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
            <LoginForm 
              onClose={() => setShowLoginModal(false)}
              onSwitchToRegister={handleSwitchToRegister}
            />
          </div>
        </div>
      )}
      
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RegisterForm 
              onClose={() => setShowRegisterModal(false)}
              onSwitchToLogin={handleSwitchToLogin}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation; 