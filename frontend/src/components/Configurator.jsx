// src/Configurator.js
import React, { useEffect, useState } from 'react';
import './Configurator.css';
import { fetchVentilationTypes } from '../services/VentilationTypes';

const Configurator = () => {
  const [ventilationTypes, setVentilationTypes] = useState([]);
  const [selectedVentilationType, setSelectedVentilationType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let ventTypes = await fetchVentilationTypes();
      
      setVentilationTypes(ventTypes);
    };
    fetchData();
  }, [])

  const [peopleCount, setPeopleCount] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Логика выбора системы вентиляции на основе введенных данных
    setResult(`Подходящая система для ${peopleCount} человек в типе "${roomType}" размером "${roomSize}" м²: ${ventilationTypes}`);
  };

  return (
    <div className="configurator-container">
      <div className="result-section">
        <h2>Результаты</h2>
        <p className="result-text">{result || "Результат будет отображен здесь"}</p>
      </div>
      <form onSubmit={handleSubmit} className="configurator-form">
        <h2>Конфигуратор</h2>
        <div className="form-group">
          <label>Тип системы вентиляции:</label>
          <select
            value={selectedVentilationType}
            onChange={(e) => setSelectedVentilationType(e.target.value)}
            required
            className="input-field select-field"
          >
            <option value="">Выберите...</option>
            {ventilationTypes.map((type) => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Размер помещения (м²):</label>
          <input
            type="number"
            value={roomSize}
            onChange={(e) => setRoomSize(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Количество человек:</label>
          <input
            type="number"
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Тип помещения:</label>
          <select value={roomType} onChange={(e) => setRoomType(e.target.value)} required className="input-field select-field">
            <option value="">Выберите...</option>
            <option value="Офис">Офис</option>
            <option value="Квартира">Квартира</option>
            <option value="Магазин">Магазин</option>
            <option value="Склад">Склад</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Найти</button>
      </form>
    </div>
  );
};

export default Configurator;