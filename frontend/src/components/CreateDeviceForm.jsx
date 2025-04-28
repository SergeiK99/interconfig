import React, { useState } from 'react';
import './CreateDeviceForm.css';

const CreateDeviceForm = ({ deviceTypes, onClose, onDeviceCreated }) => {
    const [newDevice, setNewDevice] = useState({
        name: '',
        description: '',
        price: '',
        deviceTypeId: '',
        image: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newDevice.name);
        formData.append('description', newDevice.description);
        formData.append('price', newDevice.price);
        formData.append('deviceTypeId', newDevice.deviceTypeId);
        if (newDevice.image) {
            formData.append('image', newDevice.image);
        }

        try {
            const response = await fetch('http://localhost:5115/api/Devices', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании устройства');
            }

            const createdDevice = await response.json();
            onDeviceCreated(createdDevice);
            onClose();
        } catch (error) {
            console.error('Error creating device:', error);
        }
    };

    return (
        <div className="create-device-form">
            <h2>Добавить новое устройство</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Название:</label>
                    <input
                        type="text"
                        name="name"
                        value={newDevice.name}
                        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Описание:</label>
                    <textarea
                        name="description"
                        value={newDevice.description}
                        onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Цена:</label>
                    <input
                        type="number"
                        name="price"
                        value={newDevice.price}
                        onChange={(e) => setNewDevice({ ...newDevice, price: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Тип устройства:</label>
                    <select
                        name="deviceTypeId"
                        value={newDevice.deviceTypeId}
                        onChange={(e) => setNewDevice({ ...newDevice, deviceTypeId: e.target.value })}
                        required
                    >
                        <option value="">Выберите тип устройства</option>
                        {deviceTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Изображение:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewDevice({ ...newDevice, image: e.target.files[0] })}
                    />
                </div>
                <div className="form-actions">
                    <button type="submit">Создать</button>
                    <button type="button" onClick={onClose}>Отмена</button>
                </div>
            </form>
        </div>
    );
};

export default CreateDeviceForm; 