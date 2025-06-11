import React, { useState, useEffect } from 'react';
import './AIConsultant.css';
import DeviceResultCard from './DeviceResultCard';
import LoginForm from './LoginForm';
import { fetchDeviceTypes, fetchPossibleCharacteristicsByDeviceTypeId } from '../services/DeviceTypes';

const AIConsultant = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [allPossibleCharacteristics, setAllPossibleCharacteristics] = useState({});

    useEffect(() => {
        const loadCharacteristicsData = async () => {
            try {
                const deviceTypes = await fetchDeviceTypes();
                const characteristicsMap = {};
                for (const type of deviceTypes) {
                    const characteristics = await fetchPossibleCharacteristicsByDeviceTypeId(type.id);
                    characteristicsMap[type.id] = characteristics;
                }
                setAllPossibleCharacteristics(characteristicsMap);
            } catch (error) {
                console.error('Error loading characteristics data:', error);
            }
        };

        loadCharacteristicsData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);

        // Добавляем сообщение пользователя в историю
        const newMessages = [...messages, { role: 'user', content: query }];
        setMessages(newMessages);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/AIConsultant/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    history: newMessages // Отправляем всю историю включая текущий запрос
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get recommendation');
            }

            const data = await response.json();
            
            // Добавляем ответ ассистента в историю
            setMessages([...newMessages, { 
                role: 'assistant', 
                content: data.recommendation,
                device: data.device // Сохраняем информацию об устройстве
            }]);
            console.log('Received device data:', data.device);
            setQuery(''); // Очищаем поле ввода
        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, { 
                role: 'assistant', 
                content: 'Извините, произошла ошибка при получении рекомендации.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        setMessages([]);
    };

    return (
        <div className="ai-consultant">
            <h2>ИИ-консультант по подбору устройств</h2>
            
            {/* Блок с историей чата */}
            <div className="chat-history">
                {messages.length === 0 ? (
                    <p className="empty-chat">Начните диалог, задав вопрос о выборе устройства</p>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                            <div className="message-header">
                                <strong>{message.role === 'user' ? 'Вы:' : 'Консультант:'}</strong>
                            </div>
                            <div className="message-content">
                                <p>{message.content}</p>
                                {message.role === 'assistant' && message.device && (
                                    <div className="device-card-container">
                                        {console.log('Rendering DeviceResultCard with device:', message.device, 'and characteristics:', allPossibleCharacteristics[message.device.deviceTypeId])}
                                        <DeviceResultCard 
                                            device={message.device} 
                                            possibleCharacteristics={allPossibleCharacteristics[message.device.deviceTypeId]}
                                            setShowLoginModal={setShowLoginModal}
                                            isCompact={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="consultant-form">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Опишите, какое устройство вы ищете..."
                    className="query-input"
                    rows={4}
                />
                <div className="button-group">
                    <button type="submit" disabled={isLoading || !query.trim()} className="submit-button">
                        {isLoading ? 'Загрузка...' : 'Отправить'}
                    </button>
                    <button 
                        type="button" 
                        onClick={clearHistory} 
                        className="clear-button"
                        disabled={messages.length === 0}
                    >
                        Очистить историю
                    </button>
                </div>
            </form>

            {showLoginModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <LoginForm onClose={() => setShowLoginModal(false)} onSwitchToRegister={() => {}} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIConsultant;