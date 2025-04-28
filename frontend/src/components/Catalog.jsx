import React, { useEffect, useState } from 'react';
import './Catalog.css';
import CreateDeviceForm from './CreateDeviceForm';
import DeviceCard from './DeviceCard';
import LoadingSpinner from './LoadingSpinner';
import { fetchDevices } from '../services/Devices';
import { fetchDeviceTypes } from '../services/DeviceTypes';
import { useAuth } from '../context/AuthContext';

const Catalog = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const { user } = useAuth();
    const isAdmin = user && user.role === 'Admin';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [devicesData, typesData] = await Promise.all([
                    fetchDevices(),
                    fetchDeviceTypes()
                ]);
                
                if (devicesData && typesData) {
                    setDevices(devicesData);
                    setDeviceTypes(typesData);
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
        setShowCreateForm(false);
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
                {isAdmin && (
                    <button 
                        className="create-button blue-button"
                        onClick={() => setShowCreateForm(true)}
                    >
                        Создать устройство
                    </button>
                )}
            </div>

            {showCreateForm && (
                <CreateDeviceForm 
                    deviceTypes={deviceTypes}
                    onClose={() => setShowCreateForm(false)}
                    onDeviceCreated={handleDeviceCreated}
                />
            )}

            <div className="devices-grid">
                {devices.map((device) => (
                    <DeviceCard 
                        key={device.id} 
                        device={device}
                        deviceTypes={deviceTypes}
                        onDeviceUpdated={handleDeviceUpdated}
                        onDeviceDeleted={handleDeviceDeleted}
                        isAdmin={isAdmin}
                    />
                ))}
            </div>
        </div>
    );
};

export default Catalog;