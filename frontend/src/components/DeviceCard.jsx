import React from 'react';
import './DeviceCard.css';

const DeviceCard = ({ device }) => {
    const imageUrl = device.imagePath ? `http://localhost:5115${device.imagePath}` : '/placeholder-device.png';

    return (
        <div className="device-card">
            <h2>{device.name}</h2>
            <img src={imageUrl} alt={device.name} className="device-image" />
            <div className="device-details">
                <p>{device.description}</p>
                <p>Потребление энергии: {device.powerConsumption} Вт</p>
                <p>Уровень шума: {device.noiseLevel} дБ</p>
                <p>Максимальный воздушный поток: {device.maxAirflow} м³/ч</p>
                <p>Цена: {device.price} ₽</p>
                <p>Тип вентиляции: {device.ventilationType?.name}</p>
            </div>
        </div>
    );
};

export default DeviceCard; 