import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Configurator from './components/Configurator';
import Catalog from './components/Catalog';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <div className="App">
          <Routes>
            <Route path="/" element={<Configurator />} />
            <Route path="/catalog" element={<div className="catalog-page"><Catalog /></div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;