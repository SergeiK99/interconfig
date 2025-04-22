import React, { useEffect, useState } from 'react';
import './Catalog.css';
import CreateDeviceForm from './CreateDeviceForm';
import DeviceCard from './DeviceCard';
import LoadingSpinner from './LoadingSpinner';
import { fetchDevises } from '../services/Devices';
import { fetchVentilationTypes } from '../services/VentilationTypes';

const Catalog = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [ventilationTypes, setVentilationTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [devicesData, typesData] = await Promise.all([
                    fetchDevises(),
                    fetchVentilationTypes()
                ]);
                
                if (devicesData && typesData) {
                    setDevices(devicesData);
                    setVentilationTypes(typesData);
                } else {
                    throw new Error('Ошибка загрузки данных');
                }
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

    const handleDeviceUpdated = (updatedDevice) => {
        setDevices(devices.map(device => 
            device.id === updatedDevice.id ? updatedDevice : device
        ));
    };

    const handleDeviceDeleted = (deviceId) => {
        setDevices(devices.filter(device => device.id !== deviceId));
    };

    if (loading) {
        return <LoadingSpinner message="Загрузка каталога устройств..." />;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h2>Произошла ошибка</h2>
                <p>{error}</p>
                <button 
                    className="retry-button blue-button"
                    onClick={() => window.location.reload()}
                >
                    Попробовать снова
                </button>
            </div>
        );
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
                    <DeviceCard 
                        key={device.id} 
                        device={device}
                        ventilationTypes={ventilationTypes}
                        onDeviceUpdated={handleDeviceUpdated}
                        onDeviceDeleted={handleDeviceDeleted}
                    />
                ))}
            </div>
        </div>
    );
};

export default Catalog;