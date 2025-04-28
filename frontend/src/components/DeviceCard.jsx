import React, { useState } from 'react';
import './DeviceCard.css';
import EditDeviceForm from './EditDeviceForm';

const DeviceCard = ({ device, deviceTypes, onDeviceUpdated, onDeviceDeleted, isAdmin }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const imageUrl = device.imagePath ? `http://localhost:5115${device.imagePath}` : '/placeholder-device.png';

    const handleCardClick = () => {
        if (isAdmin) {
            setShowEditForm(true);
        }
    };

    return (
        <>
            <div className={`device-card ${isAdmin ? 'admin-card' : ''}`} onClick={handleCardClick}>
                <h2>{device.name}</h2>
                <div className="device-image-container">
                    <img src={imageUrl} alt={device.name} className="device-image" />
                </div>
                <div className="device-details">
                    <p>Тип устройства: {device.deviceType?.name}</p>
                    <p>Описание: {device.description}</p>
                    <p>Потребление энергии: {device.powerConsumption} Вт</p>
                    <p>Уровень шума: {device.noiseLevel} дБ</p>
                    <p>Максимальный воздушный поток: {device.maxAirflow} м³/ч</p>
                    <p>Цена: {device.price} ₽</p>
                </div>
                {isAdmin && (
                    <div className="admin-controls">
                        <button 
                            className="edit-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEditForm(true);
                            }}
                        >
                            Редактировать
                        </button>
                        <button 
                            className="delete-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeviceDeleted(device.id);
                            }}
                        >
                            Удалить
                        </button>
                    </div>
                )}
            </div>

            {showEditForm && (
                <EditDeviceForm
                    device={device}
                    deviceTypes={deviceTypes}
                    onClose={() => setShowEditForm(false)}
                    onDeviceUpdated={onDeviceUpdated}
                    onDeviceDeleted={onDeviceDeleted}
                />
            )}
        </>
    );
};

export default DeviceCard; 