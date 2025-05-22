import React, { useState } from 'react';
import './DeviceCard.css';
import EditDeviceForm from './EditDeviceForm';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import './DeviceDetails.css';

const DeviceCard = ({ device, deviceTypes, onDeviceUpdated, onDeviceDeleted, isAdmin }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const imageUrl = device.imagePath ? `http://localhost:5115${device.imagePath}` : '/placeholder-device.png';

    const handleCardClick = () => {
        if (isAdmin) {
            setShowEditForm(true);
        } else {
            setShowDetailsModal(true);
        }
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login', { state: { returnUrl: window.location.pathname } });
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
                    <p>Цена: {device.price} ₽</p>
                </div>
                {!isAdmin ? (
                    <div className="cart-controls">
                        <Button 
                            variant="info" 
                            className="details-button me-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDetailsModal(true);
                            }}
                        >
                            <FaInfoCircle className="me-2" style={{ fontSize: '1.2rem' }} />
                            Подробнее
                        </Button>
                        <Button 
                            variant="primary" 
                            className="add-to-cart-button"
                            onClick={handleAddToCart}
                        >
                            <FaShoppingCart className="me-2" style={{ fontSize: '1.2rem' }} />
                            В корзину
                        </Button>
                    </div>
                ) : (
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

            {showEditForm && (
                <EditDeviceForm
                    device={device}
                    deviceTypes={deviceTypes}
                    onClose={() => setShowEditForm(false)}
                    onDeviceUpdated={onDeviceUpdated}
                    onDeviceDeleted={onDeviceDeleted}
                />
            )}

            {showDetailsModal && (
                <div className="device-details-overlay">
                    <div className="device-details-modal">
                        <div className="device-details-header">
                            <h2>{device.name}</h2>
                            <button className="close-button" onClick={() => setShowDetailsModal(false)}>×</button>
                        </div>
                        <div className="device-details-content">
                            <div className="device-details-image">
                                <img src={imageUrl} alt={device.name} />
                            </div>
                            <div className="device-details-info">
                                <div className="info-group">
                                    <p><strong>Тип устройства:</strong> {device.deviceType?.name}</p>
                                    <p><strong>Потребление энергии:</strong> {device.powerConsumption} Вт</p>
                                    <p><strong>Уровень шума:</strong> {device.noiseLevel} дБ</p>
                                    <p><strong>Максимальный воздушный поток:</strong> {device.maxAirflow} м³/ч</p>
                                    <p><strong>Цена:</strong> {device.price} ₽</p>
                                </div>

                                {/* Отображение дополнительных характеристик */}
                                {device.characteristics && device.characteristics.length > 0 && (
                                    <div className="characteristics-group">
                                        <h4>Характеристики:</h4>
                                        {device.characteristics.map(char => (
                                            <p key={char.id}><strong>{char.possibleCharacteristic?.name}{char.possibleCharacteristic?.unit ? ` (${char.possibleCharacteristic.unit})` : ''}:</strong> {char.value}</p>
                                        ))}
                                    </div>
                                )}

                                <div className="description-group">
                                    <h4>Описание:</h4>
                                    <p>{device.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="device-details-footer">
                            <button className="cancel-button" onClick={() => setShowDetailsModal(false)}>
                                Закрыть
                            </button>
                            {!isAdmin && (
                                <button className="add-to-cart-button-details" onClick={handleAddToCart}>
                                    <FaShoppingCart className="me-2" style={{ fontSize: '1.2rem' }} />
                                    Добавить в корзину
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeviceCard; 