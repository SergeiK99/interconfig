import React, { useState, useRef } from 'react';
import './CreateDeviceForm.css';
import { updateDevice, deleteDevice } from '../services/Devices';

const EditDeviceForm = ({ device, ventilationTypes, onClose, onDeviceUpdated, onDeviceDeleted }) => {
    const [editedDevice, setEditedDevice] = useState({
        name: device.name,
        description: device.description,
        powerConsumption: device.powerConsumption,
        noiseLevel: device.noiseLevel,
        maxAirflow: device.maxAirflow,
        price: device.price,
        ventilationTypeId: device.ventilationTypeId
    });
    const [imagePreview, setImagePreview] = useState(device.imagePath ? `http://localhost:5115${device.imagePath}` : null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleUpdateDevice = async (e) => {
        e.preventDefault();
        
        // Валидация числовых полей
        if (editedDevice.powerConsumption < 0 || 
            editedDevice.noiseLevel < 0 || 
            editedDevice.maxAirflow < 0 || 
            editedDevice.price < 0) {
            alert('Числовые значения не могут быть отрицательными');
            return;
        }
        
        try {
            const formData = new FormData();
            
            // Добавляем все поля устройства в FormData
            Object.keys(editedDevice).forEach(key => {
                formData.append(key, editedDevice[key]);
            });
            
            // Добавляем изображение, если оно было выбрано
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const updatedDevice = await updateDevice(device.id, formData);
            
            if (updatedDevice) {
                onDeviceUpdated(updatedDevice);
                onClose();
            } else {
                throw new Error('Ошибка при обновлении устройства');
            }
        } catch (err) {
            console.error('Ошибка при обновлении устройства:', err);
            alert('Ошибка при обновлении устройства: ' + err.message);
        }
    };

    const handleDeleteDevice = async () => {
        if (window.confirm('Вы уверены, что хотите удалить это устройство?')) {
            try {
                await deleteDevice(device.id);
                onDeviceDeleted(device.id);
                onClose();
            } catch (err) {
                console.error('Ошибка при удалении устройства:', err);
                alert('Ошибка при удалении устройства: ' + err.message);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedDevice(prev => ({
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
                <h2>Редактирование устройства</h2>
                <form onSubmit={handleUpdateDevice}>
                    <div className="form-group">
                        <label>Название:</label>
                        <input
                            type="text"
                            name="name"
                            value={editedDevice.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание:</label>
                        <textarea
                            name="description"
                            value={editedDevice.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Тип вентиляции:</label>
                        <select
                            name="ventilationTypeId"
                            value={editedDevice.ventilationTypeId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Выберите тип вентиляции</option>
                            {ventilationTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Потребление энергии (Вт):</label>
                        <input
                            type="number"
                            name="powerConsumption"
                            value={editedDevice.powerConsumption}
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
                            value={editedDevice.noiseLevel}
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
                            value={editedDevice.maxAirflow}
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
                            value={editedDevice.price}
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
                            />
                            <button 
                                type="button" 
                                className="image-upload-button"
                                onClick={triggerFileInput}
                            >
                                <span className="upload-icon">📷</span>
                                <span>Изменить изображение</span>
                            </button>
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Предпросмотр" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="form-button green-button">Сохранить</button>
                        <button 
                            type="button" 
                            className="form-button cancel-button"
                            onClick={handleDeleteDevice}
                        >
                            Удалить
                        </button>
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

export default EditDeviceForm; 