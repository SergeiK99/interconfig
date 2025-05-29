import React, { useState, useEffect } from 'react';
import { fetchDeviceTypesAdmin, createDeviceType, updateDeviceType, deleteDeviceType } from '../../services/DeviceTypesAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';

const DeviceTypesPage = () => {
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDeviceType, setNewDeviceType] = useState({ name: '', description: '' });
    const [editingDeviceType, setEditingDeviceType] = useState(null);

    useEffect(() => {
        loadDeviceTypes();
    }, []);

    const loadDeviceTypes = async () => {
        try {
            setLoading(true);
            const data = await fetchDeviceTypesAdmin();
            setDeviceTypes(data);
        } catch (err) {
            setError('Ошибка загрузки типов устройств');
            console.error('Error loading device types:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const createdType = await createDeviceType(newDeviceType);
            setDeviceTypes([...deviceTypes, createdType]);
            setNewDeviceType({ name: '', description: '' });
        } catch (err) {
            setError('Ошибка создания типа устройства');
            console.error('Error creating device type:', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingDeviceType) return;
        try {
            await updateDeviceType(editingDeviceType.id, editingDeviceType);
            setDeviceTypes(deviceTypes.map(type => type.id === editingDeviceType.id ? editingDeviceType : type));
            setEditingDeviceType(null);
        } catch (err) {
            setError('Ошибка обновления типа устройства');
            console.error('Error updating device type:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот тип устройства?')) {
            try {
                await deleteDeviceType(id);
                setDeviceTypes(deviceTypes.filter(type => type.id !== id));
            } catch (err) {
                setError('Ошибка удаления типа устройства');
                console.error('Error deleting device type:', err);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingDeviceType) {
            setEditingDeviceType(prev => ({ ...prev, [name]: value }));
        } else {
            setNewDeviceType(prev => ({ ...prev, [name]: value }));
        }
    };

    if (loading) {
        return <LoadingSpinner message="Загрузка типов устройств..." />;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    return (
        <div className="admin-page-container minimal-admin-flex">
            <div className="admin-form-card">
                <div className="admin-card-title">Типы устройств</div>
                <form onSubmit={editingDeviceType ? handleUpdate : handleCreate}>
                    <div className="form-group">
                        <label>Название:</label>
                        <input
                            type="text"
                            name="name"
                            value={editingDeviceType ? editingDeviceType.name : newDeviceType.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание:</label>
                        <textarea
                            name="description"
                            value={editingDeviceType ? editingDeviceType.description : newDeviceType.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="form-button green-button">{editingDeviceType ? 'Сохранить' : 'Добавить'}</button>
                        {editingDeviceType && (
                            <button type="button" className="form-button cancel-button" onClick={() => setEditingDeviceType(null)}>Отмена</button>
                        )}
                    </div>
                </form>
            </div>
            <div className="admin-list-card">
                <div className="admin-card-title">Список типов устройств</div>
                <ul>
                    {deviceTypes.map(type => (
                        <li key={type.id} className="list-item">
                            <span>{type.name}</span>
                            <div className="item-buttons">
                                <button onClick={() => setEditingDeviceType(type)} className="form-button blue-button">✎</button>
                                <button onClick={() => handleDelete(type.id)} className="form-button cancel-button">🗑</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DeviceTypesPage; 