import React, { useState, useEffect } from 'react';
import { fetchRoomTypes, createRoomType, updateRoomType, deleteRoomType } from '../../services/RoomTypes'; // Нужен будет новый сервис
import LoadingSpinner from '../../components/LoadingSpinner';

const RoomTypesPage = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRoomType, setNewRoomType] = useState({ name: '', areaCoefficient: '', peopleCoefficient: '' });
    const [editingRoomType, setEditingRoomType] = useState(null); // Для хранения редактируемого типа помещения

    useEffect(() => {
        loadRoomTypes();
    }, []);

    const loadRoomTypes = async () => {
        try {
            setLoading(true);
            const data = await fetchRoomTypes();
            setRoomTypes(data);
        } catch (err) {
            setError('Ошибка загрузки типов помещений');
            console.error('Error loading room types:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const createdType = await createRoomType(newRoomType);
            setRoomTypes([...roomTypes, createdType]);
            setNewRoomType({ name: '', areaCoefficient: '', peopleCoefficient: '' });
        } catch (err) {
            setError('Ошибка создания типа помещения');
            console.error('Error creating room type:', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingRoomType) return;
        try {
            await updateRoomType(editingRoomType.id, editingRoomType);
            setRoomTypes(roomTypes.map(type => type.id === editingRoomType.id ? editingRoomType : type));
            setEditingRoomType(null);
        } catch (err) {
            setError('Ошибка обновления типа помещения');
            console.error('Error updating room type:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот тип помещения?')) {
            try {
                await deleteRoomType(id);
                setRoomTypes(roomTypes.filter(type => type.id !== id));
            } catch (err) {
                setError('Ошибка удаления типа помещения');
                console.error('Error deleting room type:', err);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingRoomType) {
            setEditingRoomType(prev => ({ ...prev, [name]: value }));
        } else {
            setNewRoomType(prev => ({ ...prev, [name]: value }));
        }
    };

    if (loading) {
        return <LoadingSpinner message="Загрузка типов помещений..." />;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    return (
        <div className="admin-page-container">
            <h2>Управление типами помещений</h2>

            {/* Форма добавления/редактирования */}
            <div className="form-container">
                <h3>{editingRoomType ? 'Редактировать тип помещения' : 'Добавить новый тип помещения'}</h3>
                <form onSubmit={editingRoomType ? handleUpdate : handleCreate}>
                    <div className="form-group">
                        <label>Название:</label>
                        <input
                            type="text"
                            name="name"
                            value={editingRoomType ? editingRoomType.name : newRoomType.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Коэф. площади:</label>
                        <input
                            type="number"
                            name="areaCoefficient"
                            value={editingRoomType ? editingRoomType.areaCoefficient : newRoomType.areaCoefficient}
                            onChange={handleInputChange}
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Коэф. человек:</label>
                        <input
                            type="number"
                            name="peopleCoefficient"
                            value={editingRoomType ? editingRoomType.peopleCoefficient : newRoomType.peopleCoefficient}
                            onChange={handleInputChange}
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="form-button green-button">{editingRoomType ? 'Сохранить изменения' : 'Добавить'}</button>
                        {editingRoomType && (
                            <button type="button" className="form-button cancel-button" onClick={() => setEditingRoomType(null)}>Отмена</button>
                        )}
                    </div>
                </form>
            </div>

            {/* Список типов помещений */}
            <div className="list-container">
                <h3>Существующие типы помещений</h3>
                <ul>
                    {roomTypes.map(type => (
                        <li key={type.id} className="list-item">
                            <span>{type.name} (Площадь: {type.areaCoefficient}, Человек: {type.peopleCoefficient})</span>
                            <div className="item-buttons">
                                <button onClick={() => setEditingRoomType(type)} className="form-button blue-button">Редактировать</button>
                                <button onClick={() => handleDelete(type.id)} className="form-button cancel-button">Удалить</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RoomTypesPage; 