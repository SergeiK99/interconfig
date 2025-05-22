import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Configurator from './components/Configurator';
import Catalog from './components/Catalog';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AIConsultantPage from './components/pages/AIConsultantPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import RoomTypesPage from './pages/admin/RoomTypesPage';
import DeviceTypesPage from './pages/admin/DeviceTypesPage';
import PossibleCharacteristicsPage from './pages/admin/PossibleCharacteristicsPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navigation />
          <div className="App">
            <Routes>
              <Route path="/" element={<Configurator />} />
              <Route path="/catalog" element={<div className="catalog-page"><Catalog /></div>} />
              <Route path="/ai-consultant" element={<div className="ai-consultant-page"><AIConsultantPage /></div>} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              {/* Admin routes */}
              <Route path="/admin/roomtypes" element={
                <ProtectedAdminRoute>
                  <RoomTypesPage />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/devicetypes" element={
                <ProtectedAdminRoute>
                  <DeviceTypesPage />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/possiblecharacteristics" element={
                <ProtectedAdminRoute>
                  <PossibleCharacteristicsPage />
                </ProtectedAdminRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;