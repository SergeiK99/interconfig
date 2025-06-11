import React, { useState } from 'react';
import './Configurator.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import DeviceDetailsModal from './DeviceDetailsModal';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:5115${imagePath}`;
};

const DeviceResultCard = ({ device, possibleCharacteristics = [], setShowLoginModal, isCompact }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  console.log('Device object in DeviceResultCard:', device);

  const handleCardClick = (e) => {
    if (e.target.closest('.device-result-btn')) return;
    setShowDetails(true);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      setShowLoginModal && setShowLoginModal(true);
      return;
    }
    addToCart(device.id, 1);
  };

  const renderAllCharacteristicsList = (device, possibleCharacteristics = []) => {
    const main = [
      { label: 'Потр. энергии', value: device.powerConsumption + ' Вт' },
      { label: 'Шум', value: device.noiseLevel + ' дБ' },
      { label: 'Поток', value: device.maxAirflow + ' м³/ч' },
      { label: 'Цена', value: device.price + ' ₽' },
    ];
    const additional = (device.characteristics?.$values || []).map(char => {
      console.log('Processing characteristic:', char);
      const pc = possibleCharacteristics.find(pc => pc.id === char.possibleCharacteristicId);
      if (!pc) return null;
      if (pc.type === 'bool' && char.value !== 'true') return null;
      return {
        label: pc.name + (pc.unit ? ` (${pc.unit})` : ''),
        value: pc.type === 'bool' ? 'Да' : char.value
      };
    }).filter(Boolean);
    const all = [...main, ...additional];
    if (all.length === 0) return null;
    return (
      <ul style={{textAlign:'left',margin:'0 auto 0 0',paddingLeft:'1.1em',width:'fit-content',color:'#222',fontWeight:400,fontSize:'0.98em',listStyle:'none'}}>
        {all.map((item, idx) => (
          <li key={idx} style={{padding:'0.15em 0'}}>
            <span style={{color:'#007bff',fontWeight:500}}>{item.label}:</span> <span>{item.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className={`device-result-card ${isCompact ? 'compact-ai-card' : ''}`} onClick={handleCardClick}>
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
        {renderAllCharacteristicsList(device, possibleCharacteristics)}
        <div className="device-result-actions compact-actions">
          <button className="device-result-btn compact-btn" onClick={handleAddToCart}>Добавить в корзину</button>
          <button className="device-result-btn details compact-btn" onClick={e => { e.stopPropagation(); setShowDetails(true); }}>Подробнее</button>
        </div>
      </div>
      {showDetails && (
        <DeviceDetailsModal
          device={device}
          possibleCharacteristics={possibleCharacteristics}
          show={showDetails}
          onClose={() => setShowDetails(false)}
          onAddToCart={() => handleAddToCart({ stopPropagation: () => {} })}
          user={user}
        />
      )}
    </>
  );
};

export default DeviceResultCard; 