import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './styles/App.css';
import Configurator from './components/Configurator';
import Catalog from './components/Catalog';

function App() {
  return (
    <Router>
      <header className="app-header">
        <nav className="navbar">
          <ul className="nav-links">
            <li><Link to="/">Конфигуратор</Link></li>
            <li><Link to="/catalog">Каталог устройств</Link></li>
          </ul>
        </nav>
      </header>
      <div className="App">
        <Routes>
          <Route path="/" element={<Configurator />} />
          <Route path="/catalog" element={<Catalog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;