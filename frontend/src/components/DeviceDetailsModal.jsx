import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:5115${imagePath}`;
};

const DeviceDetailsModal = ({ device, possibleCharacteristics = [], show, onClose, onAddToCart, user }) => {
  if (!show) return null;

  const renderCharacteristicsList = (chars, possibleCharacteristics = []) => {
    if (!chars || chars.length === 0) return null;
    const filtered = chars.map(char => {
      const pc = possibleCharacteristics.find(pc => pc.id === char.possibleCharacteristicId);
      const name = pc ? pc.name : (char.possibleCharacteristic?.name || char.name);
      const unit = pc ? pc.unit : (char.possibleCharacteristic?.unit || '');
      const type = pc ? pc.type : (char.possibleCharacteristic?.type || '');
      if (!name) return null;
      if (type === 'bool' && char.value !== 'true') return null;
      return { id: char.id, name, unit, type, value: char.value };
    }).filter(Boolean);
    if (filtered.length === 0) return null;
    return (
      <>
        <div className="char-list-label" style={{color:'#888',fontSize:'0.97em',fontWeight:500,margin:'0.7em 0 0.3em 0',textAlign:'left'}}>Доп. характеристики</div>
        <ul style={{textAlign:'left',margin:'0 auto 0 0',paddingLeft:'1.1em',width:'fit-content',color:'#222',fontWeight:400,fontSize:'0.98em',listStyle:'none'}}>
          {filtered.map(char => (
            <li key={char.id} style={{padding:'0.15em 0'}}>
              <span style={{fontWeight:500}}>{char.name}{char.unit ? ` (${char.unit})` : ''}:</span> <span style={{color:'#222'}}>{char.type === 'bool' ? 'Да' : char.value}</span>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="device-details-overlay">
      <div className="device-details-modal">
        <div className="device-details-header">
          <h2>{device.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="device-details-content">
          <div className="device-details-image">
            <img src={getImageUrl(device.imagePath)} alt={device.name} />
          </div>
          <div className="device-details-info">
            <div className="info-group">
              <ul style={{textAlign:'left',margin:'0 auto 0 0',paddingLeft:'1.1em',width:'fit-content',color:'#222',fontWeight:400,fontSize:'0.98em',listStyle:'none'}}>
                <li><span style={{fontWeight:500}}>Тип устройства:</span> <span style={{color:'#222'}}>{device.deviceType?.name}</span></li>
                <li><span style={{fontWeight:500}}>Потребление энергии:</span> <span style={{color:'#222'}}>{device.powerConsumption} Вт</span></li>
                <li><span style={{fontWeight:500}}>Уровень шума:</span> <span style={{color:'#222'}}>{device.noiseLevel} дБ</span></li>
                <li><span style={{fontWeight:500}}>Максимальный воздушный поток:</span> <span style={{color:'#222'}}>{device.maxAirflow} м³/ч</span></li>
                <li><span style={{fontWeight:500}}>Цена:</span> <span style={{color:'#222'}}>{device.price} ₽</span></li>
              </ul>
              {device.characteristics && device.characteristics.length > 0 && renderCharacteristicsList(device.characteristics, possibleCharacteristics)}
            </div>
            <div className="description-group">
              <h4>Описание:</h4>
              <p>{device.description}</p>
            </div>
          </div>
        </div>
        <div className="device-details-footer">
          <button className="cancel-button" onClick={onClose}>
            Закрыть
          </button>
          {(!user || user.role === 'User') && (
            <button className="add-to-cart-button-details" onClick={onAddToCart}>
              <FaShoppingCart className="me-2" style={{ fontSize: '1.2rem' }} />
              Добавить в корзину
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsModal; 