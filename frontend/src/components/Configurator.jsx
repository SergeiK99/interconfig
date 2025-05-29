import React, { useEffect, useState } from 'react';
import './Configurator.css';
import { fetchDeviceTypes } from '../services/DeviceTypes';
import { fetchPossibleCharacteristicsByDeviceTypeId } from '../services/DeviceTypes';
import { fetchRoomTypes } from '../services/RoomTypes';
import { fetchBestDevice } from '../services/Devices';
import DeviceResultCard from './DeviceResultCard';
import LoginForm from './LoginForm';

const Configurator = () => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [possibleCharacteristics, setPossibleCharacteristics] = useState([]);
  const [deviceCharacteristics, setDeviceCharacteristics] = useState({});
  const [result, setResult] = useState(null); // { device, mismatches }
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [types, rooms] = await Promise.all([
          fetchDeviceTypes(),
          fetchRoomTypes()
        ]);
        setDeviceTypes(types);
        setRoomTypes(rooms);
      } catch (error) {
        setReason('Ошибка при загрузке данных');
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadCharacteristics = async () => {
      if (selectedDeviceType) {
        try {
          const characteristics = await fetchPossibleCharacteristicsByDeviceTypeId(selectedDeviceType);
          setPossibleCharacteristics(characteristics);
          const initialCharacteristics = {};
          characteristics.forEach(pc => {
            if (pc.type === 'bool') {
              initialCharacteristics[pc.id] = false;
            } else {
              initialCharacteristics[pc.id] = '';
            }
          });
          setDeviceCharacteristics(initialCharacteristics);
        } catch (error) {
          setReason('Ошибка при загрузке характеристик');
        }
      } else {
        setPossibleCharacteristics([]);
        setDeviceCharacteristics({});
      }
    };
    loadCharacteristics();
  }, [selectedDeviceType]);

  const handleCharacteristicChange = (id, value) => {
    setDeviceCharacteristics(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const getSelectedCharacteristics = () => {
    return possibleCharacteristics
      .filter(pc => {
        if (pc.type === 'bool') return deviceCharacteristics[pc.id] === true;
        return deviceCharacteristics[pc.id] !== '' && deviceCharacteristics[pc.id] !== undefined && deviceCharacteristics[pc.id] !== null;
      })
      .map(pc => ({
        possibleCharacteristicId: pc.id,
        value: pc.type === 'bool' ? (deviceCharacteristics[pc.id] ? 'true' : 'false') : String(deviceCharacteristics[pc.id])
      }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setReason('');
    try {
      const selectedChars = getSelectedCharacteristics();
      const response = await fetchBestDevice(
        selectedDeviceType,
        selectedRoomType,
        parseFloat(roomSize),
        parseInt(peopleCount),
        selectedChars
      );
      if (response && response.device) {
        setResult(response);
      } else if (response && response.reason) {
        setReason(response.reason);
      } else {
        setReason('Подходящее устройство не найдено');
      }
    } catch (error) {
      setReason('Ошибка при поиске подходящего устройства');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="configurator-main-layout">
      <div className="configurator-result-section wide compact-result">
        <h2 style={{ textAlign: 'center' }}>Результат подбора</h2>
        {loading ? (
          <p>Поиск подходящего устройства...</p>
        ) : reason ? (
          <p className="error-text">{reason}</p>
        ) : result && result.device ? (
          <DeviceResultCard device={result.device} possibleCharacteristics={possibleCharacteristics} setShowLoginModal={setShowLoginModal} />
        ) : (
          <p className="result-text">Результат будет отображен здесь</p>
        )}
        {showLoginModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <LoginForm onClose={() => setShowLoginModal(false)} onSwitchToRegister={() => {}} />
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleCalculate} className="configurator-form narrow compact-form">
        <h2>Конфигуратор</h2>
        <div className="form-group narrow compact-form-group">
          <label htmlFor="deviceType">Тип устройства:</label>
          <select
            id="deviceType"
            value={selectedDeviceType}
            onChange={(e) => setSelectedDeviceType(e.target.value)}
            required
            className="input-field select-field narrow"
          >
            <option value="">Выберите тип устройства</option>
            {deviceTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {possibleCharacteristics.length > 0 && (
          <div className="characteristics-section narrow compact-chars-section">
            <h3>Дополнительные характеристики</h3>
            {possibleCharacteristics.map(pc => (
              <div className="form-group narrow compact-form-group" key={pc.id}>
                {pc.type === 'bool' ? (
                  <label className="custom-checkbox narrow custom-checkbox-visual checkbox-right">
                    <span className="checkbox-label">{pc.name}{pc.unit ? ` (${pc.unit})` : ''}</span>
                    <input
                      type="checkbox"
                      checked={!!deviceCharacteristics[pc.id]}
                      onChange={e => handleCharacteristicChange(pc.id, e.target.checked)}
                      style={{marginLeft:'0.5em'}}
                    />
                    <span className="checkmark"></span>
                  </label>
                ) : (
                  <>
                    <label htmlFor={`char-${pc.id}`}>{pc.name}{pc.unit ? ` (${pc.unit})` : ''}</label>
                    <input
                      id={`char-${pc.id}`}
                      type={pc.type === 'number' ? 'number' : 'text'}
                      value={deviceCharacteristics[pc.id] || ''}
                      onChange={e => handleCharacteristicChange(pc.id, e.target.value)}
                      className="input-field narrow"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="form-group narrow compact-form-group">
          <label htmlFor="roomType">Тип помещения:</label>
          <select
            id="roomType"
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            required
            className="input-field select-field narrow"
          >
            <option value="">Выберите тип помещения</option>
            {roomTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group narrow compact-form-group">
          <label htmlFor="roomSize">Размер помещения (м²):</label>
          <input
            id="roomSize"
            type="number"
            value={roomSize}
            onChange={(e) => setRoomSize(e.target.value)}
            required
            min="0"
            step="0.1"
            className="input-field narrow"
          />
        </div>

        <div className="form-group narrow compact-form-group">
          <label htmlFor="peopleCount">Количество человек:</label>
          <input
            id="peopleCount"
            type="number"
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
            required
            min="1"
            className="input-field narrow"
          />
        </div>

        <button type="submit" className="submit-button narrow" disabled={loading}>
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </form>
    </div>
  );
};

export default Configurator;