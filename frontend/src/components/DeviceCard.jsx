import React, { useState } from 'react';
import './DeviceCard.css';
import EditDeviceForm from './EditDeviceForm';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';

const DeviceCard = ({ device, deviceTypes, onDeviceUpdated, onDeviceDeleted, isAdmin }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const imageUrl = device.imagePath ? `http://localhost:5115${device.imagePath}` : '/placeholder-device.png';

    const handleCardClick = () => {
        if (isAdmin) {
            setShowEditForm(true);
        }
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await addToCart(device.id, 1);
        } catch (error) {
            console.error('Error adding to cart:', error);
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
                <div className="card-actions">
                    {!isAdmin && (
                        <Button 
                            variant="primary" 
                            className="add-to-cart-button"
                            onClick={handleAddToCart}
                        >
                            <FaShoppingCart className="me-2" />
                            Добавить в корзину
                        </Button>
                    )}
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
                        </div>
                    )}
                </div>
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