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
            setError(err.message || 'Failed to fetch orders');
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

        return (
            <Badge bg={variants[status] || 'secondary'} className="order-status-badge">
                {status}
            </Badge>
        );
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading orders...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
                <Button variant="primary" onClick={fetchOrders}>
                    Try Again
                </Button>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container className="mt-4">
                <Alert variant="info">You haven't placed any orders yet.</Alert>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Start Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2>Your Orders</h2>
            {orders.map(order => (
                <Card key={order.id} className="mb-4 order-card">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Order #{order.id}</h5>
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
                                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-1"><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                                <p className="mb-0"><strong>Contact:</strong> {order.phoneNumber}</p>
                            </div>
                            <div className="text-end">
                                <h5>Total: ${order.totalPrice.toFixed(2)}</h5>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                    View Details
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