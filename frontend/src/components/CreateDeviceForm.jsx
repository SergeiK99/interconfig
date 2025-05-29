import React, { useState, useRef, useEffect } from 'react';
import './CreateDeviceForm.css';
import { createDevice } from '../services/Devices';
import { fetchPossibleCharacteristicsByDeviceTypeId } from '../services/DeviceTypes';

const CreateDeviceForm = ({ deviceTypes, onClose, onDeviceCreated }) => {
    const [newDevice, setNewDevice] = useState({
        Name: '',
        Description: '',
        PowerConsumption: '',
        NoiseLevel: '',
        MaxAirflow: '',
        Price: '',
        DeviceTypeId: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const [possibleCharacteristics, setPossibleCharacteristics] = useState([]);
    const [deviceCharacteristics, setDeviceCharacteristics] = useState({}); // { possibleCharacteristicId: value }

    useEffect(() => {
        if (newDevice.DeviceTypeId) {
            fetchPossibleCharacteristicsByDeviceTypeId(newDevice.DeviceTypeId)
                .then(data => {
                    setPossibleCharacteristics(data);
                    const initialCharacteristics = {};
                    data.forEach(pc => {
                        if (pc.type === 'bool') {
                            initialCharacteristics[pc.id] = false;
                        } else {
                            initialCharacteristics[pc.id] = '';
                        }
                    });
                    setDeviceCharacteristics(initialCharacteristics);
                })
                .catch(error => {
                    console.error('Error fetching possible characteristics:', error);
                    setPossibleCharacteristics([]);
                    setDeviceCharacteristics({});
                });
        } else {
            setPossibleCharacteristics([]);
            setDeviceCharacteristics({});
        }
    }, [newDevice.DeviceTypeId]);

    const handleCreateDevice = async (e) => {
        e.preventDefault();
        
        // Валидация числовых полей
        if (newDevice.PowerConsumption < 0 || 
            newDevice.NoiseLevel < 0 || 
            newDevice.MaxAirflow < 0 || 
            newDevice.Price < 0) {
            alert('Числовые значения не могут быть отрицательными');
            return;
        }

        // Валидация обязательных характеристик:
        const missingCharacteristic = possibleCharacteristics.find(
            pc => pc.isRequired && (deviceCharacteristics[pc.id] === '' || deviceCharacteristics[pc.id] === undefined || (pc.type === 'bool' && deviceCharacteristics[pc.id] === null))
        );
        if (missingCharacteristic) {
            alert(`Пожалуйста, заполните значение для характеристики '${missingCharacteristic.name}'.`);
            return;
        }
        
        try {
            const formData = new FormData();
            
            // Добавляем все основные поля устройства в FormData
            formData.append('Name', newDevice.Name);
            formData.append('Description', newDevice.Description);
            formData.append('PowerConsumption', newDevice.PowerConsumption);
            formData.append('NoiseLevel', newDevice.NoiseLevel);
            formData.append('MaxAirflow', newDevice.MaxAirflow);
            formData.append('Price', newDevice.Price);
            formData.append('DeviceTypeId', newDevice.DeviceTypeId);

            // Добавляем изображение, если оно было выбрано
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            // Для отладки:
            console.log('DeviceTypeId:', newDevice.DeviceTypeId);
            console.log('possibleCharacteristics:', possibleCharacteristics);
            console.log('deviceCharacteristics:', deviceCharacteristics);
            // Сборка характеристик для отправки:
            const characteristicsArray = possibleCharacteristics
                .filter(pc => pc.id > 0)
                .filter(pc => {
                    if (pc.type === 'bool') return true; // всегда отправляем для bool
                    const val = deviceCharacteristics[pc.id];
                    return val !== '' && val !== undefined && val !== null;
                })
                .map(pc => ({
                    possibleCharacteristicId: pc.id,
                    value: pc.type === 'bool'
                        ? (!!deviceCharacteristics[pc.id] ? 'true' : 'false')
                        : String(deviceCharacteristics[pc.id])
                }));
            console.log('characteristicsArray:', characteristicsArray);

            // Новый способ: отправляем все характеристики одной JSON-строкой
            formData.append('characteristics', JSON.stringify(characteristicsArray));

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

    const handleCharacteristicChange = (id, value) => {
        setDeviceCharacteristics(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
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
                            name="Name"
                            value={newDevice.Name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание:</label>
                        <textarea
                            name="Description"
                            value={newDevice.Description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Тип устройства:</label>
                        <select
                            name="DeviceTypeId"
                            value={newDevice.DeviceTypeId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Выберите тип устройства</option>
                            {deviceTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Поля для основных характеристик, которые были изначально */}
                    <div className="form-group">
                        <label>Потребление энергии (Вт):</label>
                        <input
                            type="number"
                            name="PowerConsumption"
                            value={newDevice.PowerConsumption}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Уровень шума (дБ):</label>
                        <input
                            type="number"
                            name="NoiseLevel"
                            value={newDevice.NoiseLevel}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Максимальный воздушный поток (м³/ч):</label>
                        <input
                            type="number"
                            name="MaxAirflow"
                            value={newDevice.MaxAirflow}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Цена (₽):</label>
                        <input
                            type="number"
                            name="Price"
                            value={newDevice.Price}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </div>

                    {/* Динамические поля для дополнительных характеристик */}
                    {possibleCharacteristics.length > 0 && (
                        <div className="additional-characteristics-section">
                            <h3>Дополнительные характеристики</h3>
                            {possibleCharacteristics.map(pc => (
                                <div className="form-group" key={pc.id}>
                                    {pc.type === 'bool' ? (
                                        <label className="custom-checkbox checkbox-right">
                                            <span className="checkbox-label">{pc.name}{pc.unit ? ` (${pc.unit})` : ''}</span>
                                            <input
                                                type="checkbox"
                                                checked={!!deviceCharacteristics[pc.id]}
                                                onChange={e => handleCharacteristicChange(pc.id, e.target.checked)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    ) : (
                                        <>
                                            <label>
                                                {pc.name}{pc.unit ? ` (${pc.unit})` : ''}
                                            </label>
                                            <input
                                                type={pc.type === 'number' ? 'number' : 'text'}
                                                value={deviceCharacteristics[pc.id] || ''}
                                                onChange={e => handleCharacteristicChange(pc.id, e.target.value)}
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="form-group image-upload-group">
                        <label>Изображение:</label>
                        <div className="image-upload-container">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                required
                                style={{ display: 'none' }}
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