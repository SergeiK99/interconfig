// src/Configurator.js
import React, { useEffect, useState } from 'react';
import './Configurator.css';
import { fetchDeviceTypes } from '../services/DeviceTypes';

const Configurator = () => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const loadDeviceTypes = async () => {
      try {
        let types = await fetchDeviceTypes();
        setDeviceTypes(types);
      } catch (error) {
        console.error('Error loading device types:', error);
      }
    };
    loadDeviceTypes();
  }, []);

  const handleCalculate = () => {
    setResult(`Подходящая система для ${peopleCount} человек в типе "${roomType}" размером "${roomSize}" м²: ${deviceTypes}`);
  };

  return (
    <div className="configurator-container">
      <div className="result-section">
        <h2>Результаты</h2>
        <p className="result-text">{result || "Результат будет отображен здесь"}</p>
      </div>
      <form onSubmit={handleCalculate} className="configurator-form">
        <h2>Конфигуратор</h2>
        <div className="form-group">
          <label>Тип устройства:</label>
          <select
            value={selectedDeviceType}
            onChange={(e) => setSelectedDeviceType(e.target.value)}
            required
            className="input-field select-field"
          >
            <option value="">Выберите тип устройства</option>
            {deviceTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
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