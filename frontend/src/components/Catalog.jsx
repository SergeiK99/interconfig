import React, { useEffect, useState } from 'react';
import './Catalog.css';
import CreateDeviceForm from './CreateDeviceForm';
import DeviceCard from './DeviceCard';
import LoadingSpinner from './LoadingSpinner';
import { fetchDevices } from '../services/Devices';
import { fetchDeviceTypes, fetchPossibleCharacteristicsByDeviceTypeId } from '../services/DeviceTypes';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';

const Catalog = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const { user } = useAuth();
    const isAdmin = user && user.role === 'Admin';
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [possibleCharacteristicsByType, setPossibleCharacteristicsByType] = useState({});

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

    useEffect(() => {
        const fetchAllPossibleCharacteristics = async () => {
            const map = {};
            for (const type of deviceTypes) {
                map[type.id] = await fetchPossibleCharacteristicsByDeviceTypeId(type.id);
            }
            setPossibleCharacteristicsByType(map);
        };
        if (deviceTypes.length > 0) fetchAllPossibleCharacteristics();
    }, [deviceTypes]);

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

    const filteredDevices = devices
        .filter(d => !selectedType || d.deviceTypeId === Number(selectedType))
        .filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

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
            <div className="catalog-filters">
                <select value={selectedType} onChange={e=>setSelectedType(e.target.value)} className="catalog-filter-select">
                    <option value="">Все типы</option>
                    {deviceTypes.map(dt=>(<option key={dt.id} value={dt.id}>{dt.name}</option>))}
                </select>
                <input type="text" placeholder="Поиск по названию..." value={search} onChange={e=>setSearch(e.target.value)} className="catalog-filter-search" />
            </div>

            {showCreateForm && (
                <CreateDeviceForm 
                    deviceTypes={deviceTypes}
                    onClose={() => setShowCreateForm(false)}
                    onDeviceCreated={handleDeviceCreated}
                />
            )}

            <div className="devices-grid">
                {filteredDevices.map((device) => (
                    <DeviceCard 
                        key={device.id} 
                        device={device}
                        deviceTypes={deviceTypes}
                        onDeviceUpdated={handleDeviceUpdated}
                        onDeviceDeleted={handleDeviceDeleted}
                        isAdmin={isAdmin}
                        setShowLoginModal={setShowLoginModal}
                        possibleCharacteristics={possibleCharacteristicsByType[device.deviceTypeId] || []}
                    />
                ))}
            </div>

            {showLoginModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <LoginForm 
                            onClose={() => setShowLoginModal(false)}
                            onSwitchToRegister={() => {}}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalog;