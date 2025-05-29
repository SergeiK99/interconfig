import React, { useState } from 'react';
import './DeviceCard.css';
import EditDeviceForm from './EditDeviceForm';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from 'react-bootstrap';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import './DeviceDetails.css';
import DeviceDetailsModal from './DeviceDetailsModal';

const DeviceCard = ({ device, deviceTypes, onDeviceUpdated, onDeviceDeleted, isAdmin, setShowLoginModal, possibleCharacteristics = [] }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();
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
            setShowLoginModal(true);
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
                <DeviceDetailsModal
                    device={device}
                    possibleCharacteristics={possibleCharacteristics}
                    show={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    onAddToCart={() => handleAddToCart({ stopPropagation: () => {} })}
                    user={user}
                />
            )}
        </>
    );
};

export default DeviceCard; 