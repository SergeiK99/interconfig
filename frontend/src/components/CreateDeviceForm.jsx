import React, { useState } from 'react';
import './CreateDeviceForm.css';

const CreateDeviceForm = ({ ventilationTypes, onClose, onDeviceCreated }) => {
    const [newDevice, setNewDevice] = useState({
        name: '',
        description: '',
        powerConsumption: '',
        noiseLevel: '',
        maxAirflow: '',
        price: '',
        image: '',
        ventilationTypeId: ''
    });

    const handleCreateDevice = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5115/api/Devices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDevice),
            });
            
            if (!response.ok) {
                throw new Error('Ошибка при создании устройства');
            }
            
            const createdDevice = await response.json();
            onDeviceCreated(createdDevice);
            onClose();
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
                        <label>Тип вентиляции:</label>
                        <select
                            name="ventilationTypeId"
                            value={newDevice.ventilationTypeId}
                            onChange={handleInputChange}
                            required
                            className="input-field select-field"
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
                            value={newDevice.powerConsumption}
                            onChange={handleInputChange}
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
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>URL изображения:</label>
                        <input
                            type="text"
                            name="image"
                            value={newDevice.image}
                            onChange={handleInputChange}
                            required
                        />
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