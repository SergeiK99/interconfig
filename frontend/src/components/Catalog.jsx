import React, { useEffect, useState } from 'react';

const Catalog = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch('http://localhost:5115/api/Devices'); // Путь к вашему API
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                const data = await response.json();
                setDevices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, []);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div className="device-list-container">
            <h1>Список устройств</h1>
            <ul>
                {devices.map((device) => (
                    <li key={device.id} className="device-item">
                        <h2>{device.name}</h2>
                        <img src={device.image} alt={device.name} className="device-image" />
                        <p>{device.description}</p>
                        <p>Потребление энергии: {device.powerConsumption} Вт</p>
                        <p>Уровень шума: {device.noiseLevel} дБ</p>
                        <p>Максимальный воздушный поток: {device.maxAirflow} м³/ч</p>
                        <p>Цена: {device.price} ₽</p>
                        <p>Тип вентиляции: {device.ventilationType?.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Catalog;