import React, { useEffect, useState } from 'react';
import './Catalog.css';
import CreateDeviceForm from './CreateDeviceForm';
import DeviceCard from './DeviceCard';

const Catalog = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [ventilationTypes, setVentilationTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [devicesResponse, typesResponse] = await Promise.all([
                    fetch('http://localhost:5115/api/Devices'),
                    fetch('http://localhost:5115/api/VentilationTypes')
                ]);
                
                if (!devicesResponse.ok || !typesResponse.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                
                const devicesData = await devicesResponse.json();
                const typesData = await typesResponse.json();
                
                setDevices(devicesData);
                setVentilationTypes(typesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeviceCreated = (newDevice) => {
        setDevices([...devices, newDevice]);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div className="device-list-container">
            <div className="header-section">
                <h1>Каталог</h1>
                <button 
                    className="create-button blue-button"
                    onClick={() => setShowCreateForm(true)}
                >
                    Создать устройство
                </button>
            </div>

            {showCreateForm && (
                <CreateDeviceForm 
                    ventilationTypes={ventilationTypes}
                    onClose={() => setShowCreateForm(false)}
                    onDeviceCreated={handleDeviceCreated}
                />
            )}

            <div className="devices-grid">
                {devices.map((device) => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>
        </div>
    );
};

export default Catalog;