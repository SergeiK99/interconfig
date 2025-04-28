import React, { useState, useRef } from 'react';
import './CreateDeviceForm.css';
import { createDevice } from '../services/Devices';

const CreateDeviceForm = ({ deviceTypes, onClose, onDeviceCreated }) => {
    const [newDevice, setNewDevice] = useState({
        name: '',
        description: '',
        powerConsumption: '',
        noiseLevel: '',
        maxAirflow: '',
        price: '',
        deviceTypeId: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleCreateDevice = async (e) => {
        e.preventDefault();
        
        // Валидация числовых полей
        if (newDevice.powerConsumption < 0 || 
            newDevice.noiseLevel < 0 || 
            newDevice.maxAirflow < 0 || 
            newDevice.price < 0) {
            alert('Числовые значения не могут быть отрицательными');
            return;
        }
        
        try {
            const formData = new FormData();
            
            // Добавляем все поля устройства в FormData
            Object.keys(newDevice).forEach(key => {
                formData.append(key, newDevice[key]);
            });
            
            // Добавляем изображение, если оно было выбрано
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const createdDevice = await createDevice(formData);
            
            if (createdDevice) {
                onDeviceCreated(createdDevice);
                onClose();
            } else {
                throw new Error('Ошибка при создании устройства');
            }
        } catch (err) {
            console.error('Ошибка при создании устройства:', err);
            alert('Ошибка при создании устройства: ' + err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDevice(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Создаем URL для предпросмотра изображения
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="create-form-overlay">
            <div className="create-form">
                <h2>Создание нового устройства</h2>
                <form onSubmit={handleCreateDevice}>
                    <div className="form-group">
                        <label>Название:</label>
                        <input
                            type="text"
                            name="name"
                            value={newDevice.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание:</label>
                        <textarea
                            name="description"
                            value={newDevice.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Тип устройства:</label>
                        <select
                            name="deviceTypeId"
                            value={newDevice.deviceTypeId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Выберите тип устройства</option>
                            {deviceTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Потребление энергии (Вт):</label>
                        <input
                            type="number"
                            name="powerConsumption"
                            value={newDevice.powerConsumption}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Уровень шума (дБ):</label>
                        <input
                            type="number"
                            name="noiseLevel"
                            value={newDevice.noiseLevel}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Максимальный воздушный поток (м³/ч):</label>
                        <input
                            type="number"
                            name="maxAirflow"
                            value={newDevice.maxAirflow}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Цена (₽):</label>
                        <input
                            type="number"
                            name="price"
                            value={newDevice.price}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group image-upload-group">
                        <label>Изображение:</label>
                        <div className="image-upload-container">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                                required
                            />
                            <button 
                                type="button" 
                                className="image-upload-button"
                                onClick={triggerFileInput}
                            >
                                <span className="upload-icon">📷</span>
                                <span>Выбрать изображение</span>
                            </button>
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Предпросмотр" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="form-button green-button">Создать</button>
                        <button 
                            type="button" 
                            className="form-button cancel-button"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDeviceForm; 