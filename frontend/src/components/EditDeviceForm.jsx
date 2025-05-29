import React, { useState, useRef, useEffect } from 'react';
import './CreateDeviceForm.css';
import { updateDevice, deleteDevice } from '../services/Devices';
import { fetchPossibleCharacteristicsByDeviceTypeId } from '../services/DeviceTypes';

const EditDeviceForm = ({ device, deviceTypes, onClose, onDeviceUpdated, onDeviceDeleted }) => {
    const [editedDevice, setEditedDevice] = useState({
        name: device.name,
        description: device.description,
        powerConsumption: device.powerConsumption,
        noiseLevel: device.noiseLevel,
        maxAirflow: device.maxAirflow,
        price: device.price,
        deviceTypeId: device.deviceTypeId
    });
    const [imagePreview, setImagePreview] = useState(device.imagePath ? `http://localhost:5115${device.imagePath}` : null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const [possibleCharacteristics, setPossibleCharacteristics] = useState([]);
    const [deviceCharacteristics, setDeviceCharacteristics] = useState({});

    useEffect(() => {
        if (editedDevice.deviceTypeId) {
            fetchPossibleCharacteristicsByDeviceTypeId(editedDevice.deviceTypeId)
                .then(data => {
                    setPossibleCharacteristics(data);
                    const initialCharacteristics = {};
                    data.forEach(pc => {
                        const existingChar = device.characteristics?.find(c => c.possibleCharacteristicId === pc.id);
                        if (pc.type === 'bool') {
                            initialCharacteristics[pc.id] = existingChar ? existingChar.value === 'true' : false;
                        } else {
                            initialCharacteristics[pc.id] = existingChar ? existingChar.value : '';
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
    }, [editedDevice.deviceTypeId, device.characteristics]);

    const handleUpdateDevice = async (e) => {
        e.preventDefault();
        
        if (editedDevice.powerConsumption < 0 || 
            editedDevice.noiseLevel < 0 || 
            editedDevice.maxAirflow < 0 || 
            editedDevice.price < 0) {
            alert('Числовые значения не могут быть отрицательными');
            return;
        }

        const missingCharacteristic = possibleCharacteristics.find(
            pc => pc.isRequired && (deviceCharacteristics[pc.id] === '' || deviceCharacteristics[pc.id] === undefined)
        );
        if (missingCharacteristic) {
            alert(`Пожалуйста, заполните значение для характеристики '${missingCharacteristic.name}'.`);
            return;
        }
        
        try {
            const formData = new FormData();
            
            formData.append('Name', editedDevice.name);
            formData.append('Description', editedDevice.description);
            formData.append('PowerConsumption', editedDevice.powerConsumption);
            formData.append('NoiseLevel', editedDevice.noiseLevel);
            formData.append('MaxAirflow', editedDevice.maxAirflow);
            formData.append('Price', editedDevice.price);
            formData.append('DeviceTypeId', editedDevice.deviceTypeId);

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const characteristicsArray = possibleCharacteristics
                .filter(pc => {
                    if (pc.type === 'bool') return true;
                    const val = deviceCharacteristics[pc.id];
                    return val !== '' && val !== undefined && val !== null;
                })
                .map(pc => ({
                    possibleCharacteristicId: pc.id,
                    value: pc.type === 'bool'
                        ? (deviceCharacteristics[pc.id] ? 'true' : 'false')
                        : String(deviceCharacteristics[pc.id])
                }));

            formData.append('characteristics', JSON.stringify(characteristicsArray));

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
                        <label>Тип устройства:</label>
                        <select
                            name="deviceTypeId"
                            value={editedDevice.deviceTypeId}
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

                    {possibleCharacteristics.length > 0 && (
                        <div className="additional-characteristics-section">
                            <h3>Дополнительные характеристики</h3>
                            {possibleCharacteristics.map(pc => (
                                <div className="form-group" key={pc.id}>
                                    {pc.type === 'bool' ? (
                                        <label className="custom-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={!!deviceCharacteristics[pc.id]}
                                                onChange={e => handleCharacteristicChange(pc.id, e.target.checked)}
                                            />
                                            <span className="checkmark"></span>
                                            <span className="checkbox-label">{pc.name}{pc.unit ? ` (${pc.unit})` : ''}</span>
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