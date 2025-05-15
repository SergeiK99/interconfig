import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Form, Row, Col, Alert } from 'react-bootstrap';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';

const getCartItemImageUrl = (item) => {
    if (item.device && item.device.imagePath) {
        return `http://localhost:5115${item.device.imagePath}`;
    }
    if (item.imagePath) {
        return `http://localhost:5115${item.imagePath}`;
    }
    if (item.deviceImagePath) {
        return `http://localhost:5115${item.deviceImagePath}`;
    }
    return '/placeholder-device.png';
};

const CartPage = () => {
    const { cart, loading, error, updateCartItem, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState({
        shippingAddress: '',
        phoneNumber: '',
        email: '',
        notes: ''
    });

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateCartItem(parseInt(itemId), parseInt(newQuantity));
    };

    const handleRemoveItem = async (itemId) => {
        await removeFromCart(parseInt(itemId));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        navigate('/checkout', { state: { orderData } });
    };

    if (loading) {
        return <Container className="mt-4"><Alert variant="info">Загрузка корзины...</Alert></Container>;
    }

    if (error) {
        return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <Container className="mt-4">
                <Alert variant="info">Ваша корзина пуста</Alert>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Продолжить покупки
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">
                <FaShoppingCart className="me-2" style={{ fontSize: '1.5rem' }} />
                Корзина
            </h2>
            <Row>
                <Col md={8}>
                    {cart.items.map(item => {
                        console.log('Cart item:', item);
                        return (
                        <Card key={item.id} className="mb-3">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={3} className="text-center">
                                        <img
                                            src={getCartItemImageUrl(item)}
                                            alt={item.deviceName}
                                            className="img-fluid cart-item-image"
                                            style={{ 
                                                maxHeight: '100px', 
                                                maxWidth: '100%', 
                                                objectFit: 'contain' 
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder-device.png';
                                            }}
                                        />
                                    </Col>
                                    <Col md={5}>
                                        <h5>{item.deviceName}</h5>
                                        <p className="text-muted">Цена: {item.devicePrice} ₽</p>
                                    </Col>
                                    <Col md={4}>
                                        <div className="d-flex align-items-center justify-content-end">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            >
                                                <FaMinus />
                                            </Button>
                                            <Form.Control
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                className="mx-2"
                                                style={{ width: '60px' }}
                                                readOnly
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                <FaPlus />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="ms-2"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        );
                    })}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <h4>Сводка заказа</h4>
                            <div className="d-flex justify-content-between mb-3 mt-4 border-top pt-3">
                                <strong>Сумма заказа:</strong>
                                <strong>{cart.totalPrice} ₽</strong>
                            </div>
                            <Form onSubmit={handleCheckout}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Адрес доставки</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="shippingAddress"
                                        value={orderData.shippingAddress}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Номер телефона</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phoneNumber"
                                        value={orderData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={orderData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Примечания (необязательно)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="notes"
                                        value={orderData.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100"
                                >
                                    Перейти к оформлению
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage; 