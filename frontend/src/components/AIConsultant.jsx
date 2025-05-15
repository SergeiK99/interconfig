import React, { useState } from 'react';
import './AIConsultant.css';

const AIConsultant = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
            setMessages([...newMessages, { role: 'assistant', content: data.recommendation }]);
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
        </div>
    );
};

export default AIConsultant;