import React, { useState } from 'react';
import './Configurator.css';
import { useCart } from '../context/CartContext';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:5115${imagePath}`;
};

function getCharacteristicName(char, possibleCharacteristics) {
  if (char.possibleCharacteristic?.name) return char.possibleCharacteristic.name;
  if (possibleCharacteristics) {
    const found = possibleCharacteristics.find(pc => pc.id === char.possibleCharacteristicId);
    if (found) return found.name;
  }
  return undefined;
}
function getCharacteristicUnit(char, possibleCharacteristics) {
  if (char.possibleCharacteristic?.unit) return char.possibleCharacteristic.unit;
  if (possibleCharacteristics) {
    const found = possibleCharacteristics.find(pc => pc.id === char.possibleCharacteristicId);
    if (found) return found.unit;
  }
  return undefined;
}

const DeviceResultCard = ({ device }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { addToCart } = useCart();
  const possibleCharacteristics = device.possibleCharacteristics || [];

  const handleCardClick = (e) => {
    if (e.target.closest('.device-result-btn')) return;
    setShowDetails(true);
  };

  const renderCharacteristics = (chars) =>
    chars
      .map(char => {
        const name = getCharacteristicName(char, possibleCharacteristics);
        const unit = getCharacteristicUnit(char, possibleCharacteristics);
        if (!name) return null;
        return (
          <span key={char.id}>
            {name}{unit ? ` (${unit})` : ''}: {char.value}
          </span>
        );
      })
      .filter(Boolean);

  return (
    <>
      <div className="device-result-card" onClick={handleCardClick}>
        <div className="device-result-image-block">
          {getImageUrl(device.imagePath) && (
            <img
              src={getImageUrl(device.imagePath)}
              alt={device.name}
              className="device-result-image"
            />
          )}
        </div>
        <div className="device-result-title">{device.name}</div>
        <div className="device-result-specs-row">
          <span><b>Потр. энергии:</b> {device.powerConsumption} Вт</span>
          <span><b>Шум:</b> {device.noiseLevel} дБ</span>
          <span><b>Поток:</b> {device.maxAirflow} м³/ч</span>
          <span><b>Цена:</b> {device.price} ₽</span>
        </div>
        {device.characteristics && renderCharacteristics(device.characteristics).length > 0 && (
          <div className="device-result-additional-row">
            {renderCharacteristics(device.characteristics)}
          </div>
        )}
        <div className="device-result-actions">
          <button className="device-result-btn" onClick={e => { e.stopPropagation(); addToCart(device.id, 1); }}>Добавить в корзину</button>
          <button className="device-result-btn details" onClick={e => { e.stopPropagation(); setShowDetails(true); }}>Подробнее</button>
        </div>
      </div>
      {showDetails && (
        <div className="device-details-overlay">
          <div className="device-details-modal">
            <div className="device-details-header">
              <h2>{device.name}</h2>
              <button className="close-button" onClick={() => setShowDetails(false)}>×</button>
            </div>
            <div className="device-details-content">
              <div className="device-details-image">
                <img src={getImageUrl(device.imagePath)} alt={device.name} />
              </div>
              <div className="device-details-info">
                <div className="info-group">
                  <p><strong>Тип устройства:</strong> {device.deviceType?.name}</p>
                  <p><strong>Потребление энергии:</strong> {device.powerConsumption} Вт</p>
                  <p><strong>Уровень шума:</strong> {device.noiseLevel} дБ</p>
                  <p><strong>Максимальный воздушный поток:</strong> {device.maxAirflow} м³/ч</p>
                  <p><strong>Цена:</strong> {device.price} ₽</p>
                </div>
                {device.characteristics && renderCharacteristics(device.characteristics).length > 0 && (
                  <div className="characteristics-group">
                    <h4>Характеристики:</h4>
                    {device.characteristics
                      .map(char => {
                        const name = getCharacteristicName(char, possibleCharacteristics);
                        const unit = getCharacteristicUnit(char, possibleCharacteristics);
                        if (!name) return null;
                        return (
                          <p key={char.id}>
                            <strong>{name}{unit ? ` (${unit})` : ''}:</strong> {char.value}
                          </p>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                )}
                <div className="description-group">
                  <h4>Описание:</h4>
                  <p>{device.description}</p>
                </div>
              </div>
            </div>
            <div className="device-details-footer">
              <button className="cancel-button" onClick={() => setShowDetails(false)}>
                Закрыть
              </button>
              <button className="add-to-cart-button-details" onClick={() => addToCart(device.id, 1)}>
                Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceResultCard; 