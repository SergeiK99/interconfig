import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { orderService } from '../services/orderService';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getUserOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Не удалось загрузить заказы');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            Pending: 'warning',
            Processing: 'info',
            Shipped: 'primary',
            Delivered: 'success',
            Cancelled: 'danger'
        };

        // Перевод статусов заказов
        const statusTranslations = {
            'Pending': 'В ожидании',
            'Processing': 'В обработке',
            'Shipped': 'Отправлен',
            'Delivered': 'Доставлен',
            'Cancelled': 'Отменен'
        };

        return (
            <Badge bg={variants[status] || 'secondary'} className="order-status-badge">
                {statusTranslations[status] || status}
            </Badge>
        );
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка заказов...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
                <Button variant="primary" onClick={fetchOrders}>
                    Попробовать снова
                </Button>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container className="mt-4">
                <Alert variant="info">У вас пока нет заказов.</Alert>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Начать покупки
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2>Ваши заказы</h2>
            {orders.map(order => (
                <Card key={order.id} className="mb-4 order-card">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Заказ #{order.id}</h5>
                            <div>
                                {getStatusBadge(order.status)}
                                <span className="ms-2 text-muted">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="mb-3">
                            {order.items.map(item => (
                                <div key={item.id} className="d-flex justify-content-between mb-2">
                                    <span>{item.deviceName} x {item.quantity}</span>
                                    <span>{(item.unitPrice * item.quantity).toFixed(2)} ₽</span>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-1"><strong>Адрес доставки:</strong> {order.shippingAddress}</p>
                                <p className="mb-0"><strong>Контакт:</strong> {order.phoneNumber}</p>
                            </div>
                            <div className="text-end">
                                <h5>Итого: {order.totalPrice.toFixed(2)} ₽</h5>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                    Просмотр деталей
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default OrdersPage; 