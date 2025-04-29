import React, { useState } from 'react';
import './AIConsultant.css';

const AIConsultant = () => {
    const [query, setQuery] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/AIConsultant/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(query),
            });

            if (!response.ok) {
                throw new Error('Failed to get recommendation');
            }

            const data = await response.json();
            setRecommendation(data.recommendation);
        } catch (error) {
            console.error('Error:', error);
            setRecommendation('Извините, произошла ошибка при получении рекомендации.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-consultant">
            <h2>ИИ-консультант по подбору устройств</h2>
            <form onSubmit={handleSubmit} className="consultant-form">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Опишите, какое устройство вы ищете..."
                    className="query-input"
                    rows={4}
                />
                <button type="submit" disabled={isLoading} className="submit-button">
                    {isLoading ? 'Загрузка...' : 'Получить рекомендацию'}
                </button>
            </form>
            {recommendation && (
                <div className="recommendation">
                    <h3>Рекомендация:</h3>
                    <p>{recommendation}</p>
                </div>
            )}
        </div>
    );
};

export default AIConsultant; 