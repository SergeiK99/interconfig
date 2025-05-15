import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { orderService } from '../services/orderService';

const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (!cart || cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate, user, location]);

    const handlePlaceOrder = async () => {
        if (!location.state?.orderData) {
            setError('Данные заказа отсутствуют');
            return;
        }

        if (!user) {
            setError('Вы должны быть авторизованы для оформления заказа');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const orderData = {
                ...location.state.orderData,
                items: cart.items.map(item => ({
                    deviceId: item.deviceId,
                    quantity: item.quantity
                }))
            };

            const createdOrder = await orderService.createOrder(orderData);
            setOrder(createdOrder);
            await clearCart();
        } catch (err) {
            console.error('Error placing order:', err);
            if (err.response?.status === 401) {
                setError('Ваша сессия истекла. Пожалуйста, войдите снова.');
                navigate('/login', { state: { from: location.pathname } });
            } else {
                setError(err.message || 'Не удалось оформить заказ');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Обработка заказа...</span>
                </Spinner>
                <p className="mt-3">Обработка вашего заказа...</p>
            </Container>
        );
    }

    if (order) {
        return (
            <Container className="mt-4">
                <Card>
                    <Card.Body className="text-center">
                        <h2>Заказ подтвержден!</h2>
                        <p className="lead">Спасибо за ваш заказ!</p>
                        <p>Номер вашего заказа: <strong>{order.id}</strong></p>
                        <p>Мы отправили подтверждение на email: <strong>{order.email}</strong></p>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/orders')}
                            className="mt-3"
                        >
                            Посмотреть детали заказа
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <h2>Проверьте ваш заказ</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <div className="mb-4">
                        <h4>Сводка заказа</h4>
                        {cart.items.map(item => (
                            <div key={item.id} className="d-flex justify-content-between mb-2">
                                <span>{item.deviceName} x {item.quantity}</span>
                                <span>{(item.devicePrice * item.quantity).toFixed(2)} ₽</span>
                            </div>
                        ))}
                        <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                            <strong>Сумма заказа:</strong>
                            <strong>{cart.totalPrice.toFixed(2)} ₽</strong>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4>Информация о доставке</h4>
                        <p><strong>Адрес:</strong> {location.state?.orderData?.shippingAddress}</p>
                        <p><strong>Телефон:</strong> {location.state?.orderData?.phoneNumber}</p>
                        <p><strong>Email:</strong> {location.state?.orderData?.email}</p>
                        {location.state?.orderData?.notes && (
                            <p><strong>Примечания:</strong> {location.state.orderData.notes}</p>
                        )}
                    </div>

                    <div className="d-flex justify-content-between">
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/cart')}
                        >
                            Вернуться в корзину
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? 'Оформление заказа...' : 'Оформить заказ'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CheckoutPage; 