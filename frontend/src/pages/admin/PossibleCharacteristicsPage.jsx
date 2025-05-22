import React, { useState, useEffect } from 'react';
import { fetchPossibleCharacteristics, createPossibleCharacteristic, updatePossibleCharacteristic, deletePossibleCharacteristic } from '../../services/PossibleCharacteristics';
import { fetchDeviceTypes } from '../../services/DeviceTypes'; // Используем обычный сервис типов устройств для списка выбора
import LoadingSpinner from '../../components/LoadingSpinner';

const PossibleCharacteristicsPage = () => {
    const [possibleCharacteristics, setPossibleCharacteristics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [filterDeviceTypeId, setFilterDeviceTypeId] = useState('');
    const [newCharacteristic, setNewCharacteristic] = useState({ name: '', unit: '', deviceTypeId: '', type: 'string', isRequired: false });
    const [editingCharacteristic, setEditingCharacteristic] = useState(null);

    useEffect(() => {
        loadPossibleCharacteristics(filterDeviceTypeId);
        loadDeviceTypes();
    }, [filterDeviceTypeId]);

    const loadPossibleCharacteristics = async (deviceTypeId) => {
        try {
            setLoading(true);
            const data = await fetchPossibleCharacteristics(deviceTypeId);
            setPossibleCharacteristics(data);
        } catch (err) {
            setError('Ошибка загрузки возможных характеристик');
            console.error('Error loading possible characteristics:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadDeviceTypes = async () => {
        try {
            const data = await fetchDeviceTypes();
            setDeviceTypes(data);
        } catch (err) {
            console.error('Error loading device types for filter:', err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const characteristicToCreate = {
                ...newCharacteristic,
                deviceTypeId: parseInt(newCharacteristic.deviceTypeId, 10)
            };
            const createdCharacteristic = await createPossibleCharacteristic(characteristicToCreate);
            setPossibleCharacteristics([...possibleCharacteristics, createdCharacteristic]);
            setNewCharacteristic({ name: '', unit: '', deviceTypeId: '', type: 'string', isRequired: false });
        } catch (err) {
            setError('Ошибка создания возможной характеристики');
            console.error('Error creating possible characteristic:', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingCharacteristic) return;
        try {
            const characteristicToUpdate = {
                ...editingCharacteristic,
                deviceTypeId: parseInt(editingCharacteristic.deviceTypeId, 10)
            };
            await updatePossibleCharacteristic(editingCharacteristic.id, characteristicToUpdate);
            setPossibleCharacteristics(possibleCharacteristics.map(char => char.id === editingCharacteristic.id ? characteristicToUpdate : char));
            setEditingCharacteristic(null);
        } catch (err) {
            setError('Ошибка обновления возможной характеристики');
            console.error('Error updating possible characteristic:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту возможную характеристику?')) {
            try {
                await deletePossibleCharacteristic(id);
                setPossibleCharacteristics(possibleCharacteristics.filter(char => char.id !== id));
            } catch (err) {
                setError('Ошибка удаления возможной характеристики');
                console.error('Error deleting possible characteristic:', err);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingCharacteristic) {
            setEditingCharacteristic(prev => ({ ...prev, [name]: value }));
        } else {
            setNewCharacteristic(prev => ({ ...prev, [name]: value }));
        }
    };

    if (loading) {
        return <LoadingSpinner message="Загрузка возможных характеристик..." />;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    return (
        <div className="admin-page-container">
            <h2>Управление возможными характеристиками</h2>

            {/* Фильтр по типу устройства */}
            <div className="filter-container form-group">
                <label>Фильтр по типу устройства:</label>
                <select value={filterDeviceTypeId} onChange={(e) => setFilterDeviceTypeId(e.target.value)}>
                    <option value="">Все типы устройств</option>
                    {deviceTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                </select>
            </div>

            {/* Форма добавления/редактирования */}
            <div className="form-container">
                <h3>{editingCharacteristic ? 'Редактировать характеристику' : 'Добавить новую возможную характеристику'}</h3>
                <form onSubmit={editingCharacteristic ? handleUpdate : handleCreate}>
                    <div className="form-group">
                        <label>Тип устройства:</label>
                         <select
                            name="deviceTypeId"
                            value={editingCharacteristic ? editingCharacteristic.deviceTypeId : newCharacteristic.deviceTypeId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Выберите тип устройства</option>
                            {deviceTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Название:</label>
                        <input
                            type="text"
                            name="name"
                            value={editingCharacteristic ? editingCharacteristic.name : newCharacteristic.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                     <div className="form-group">
                        <label>Единица измерения (опционально):</label>
                        <input
                            type="text"
                            name="unit"
                            value={editingCharacteristic ? editingCharacteristic.unit : newCharacteristic.unit}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Тип значения:</label>
                        <select
                            name="type"
                            value={editingCharacteristic ? editingCharacteristic.type : newCharacteristic.type || 'string'}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="string">Строка</option>
                            <option value="number">Число</option>
                            <option value="bool">Да/Нет (булево)</option>
                        </select>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="form-button green-button">{editingCharacteristic ? 'Сохранить изменения' : 'Добавить'}</button>
                        {editingCharacteristic && (
                            <button type="button" className="form-button cancel-button" onClick={() => setEditingCharacteristic(null)}>Отмена</button>
                        )}
                    </div>
                </form>
            </div>

            {/* Список возможных характеристик */}
            <div className="list-container">
                <h3>Существующие возможные характеристики</h3>
                <ul>
                    {possibleCharacteristics.map(char => (
                        <li key={char.id} className="list-item">
                            <span>{char.name} ({char.deviceType?.name}){char.unit ? ` (${char.unit})` : ''}</span>
                            <div className="item-buttons">
                                <button onClick={() => setEditingCharacteristic(char)} className="form-button blue-button">Редактировать</button>
                                <button onClick={() => handleDelete(char.id)} className="form-button cancel-button">Удалить</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PossibleCharacteristicsPage; 