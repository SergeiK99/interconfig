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
            setError('Order data is missing');
            return;
        }

        if (!user) {
            setError('You must be logged in to place an order');
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
                setError('Your session has expired. Please log in again.');
                navigate('/login', { state: { from: location.pathname } });
            } else {
                setError(err.message || 'Failed to place order');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Processing order...</span>
                </Spinner>
                <p className="mt-3">Processing your order...</p>
            </Container>
        );
    }

    if (order) {
        return (
            <Container className="mt-4">
                <Card>
                    <Card.Body className="text-center">
                        <h2>Order Confirmed!</h2>
                        <p className="lead">Thank you for your purchase!</p>
                        <p>Your order number is: <strong>{order.id}</strong></p>
                        <p>We've sent a confirmation email to: <strong>{order.email}</strong></p>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/orders')}
                            className="mt-3"
                        >
                            View Order Details
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
                    <h2>Review Your Order</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <div className="mb-4">
                        <h4>Order Summary</h4>
                        {cart.items.map(item => (
                            <div key={item.id} className="d-flex justify-content-between mb-2">
                                <span>{item.deviceName} x {item.quantity}</span>
                                <span>${(item.devicePrice * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="d-flex justify-content-between mt-3">
                            <strong>Total:</strong>
                            <strong>${cart.totalPrice.toFixed(2)}</strong>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4>Shipping Information</h4>
                        <p><strong>Address:</strong> {location.state?.orderData?.shippingAddress}</p>
                        <p><strong>Phone:</strong> {location.state?.orderData?.phoneNumber}</p>
                        <p><strong>Email:</strong> {location.state?.orderData?.email}</p>
                        {location.state?.orderData?.notes && (
                            <p><strong>Notes:</strong> {location.state.orderData.notes}</p>
                        )}
                    </div>

                    <div className="d-flex justify-content-between">
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/cart')}
                        >
                            Back to Cart
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CheckoutPage; 