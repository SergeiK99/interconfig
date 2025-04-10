import React from 'react';
import './DeviceCard.css';

const DeviceCard = ({ device }) => {
    return (
        <div className="device-card">
            <h2>{device.name}</h2>
            <img src={device.image} alt={device.name} className="device-image" />
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