// src/pages/Orders.jsx
import React, { useContext, useEffect, useState } from "react";
import { Accordion, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../store/AuthContext.jsx";

export default function Orders() {
    const { token, isAuthenticated } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrders() {
            if (!isAuthenticated) {
                setError("You are not authenticated. Please log in to view your orders.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch("http://localhost:5050/orders", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [token, isAuthenticated]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    return (
        <div className="container my-4">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                <Accordion defaultActiveKey="0">
                    {orders.map((order, index) => {
                        const orderData = order.orderData;
                        const createdAt = orderData?.createdAt ? new Date(orderData.createdAt).toLocaleString() : "No date";
                        const address = orderData?.customer
                            ? `${orderData.customer.address.street} ${orderData.customer.address.streetNumber}, ${orderData.customer.address.postalCode} ${orderData.customer.address.city}`
                            : "No address";
                        return (
                            <Accordion.Item eventKey={index.toString()} key={order._id}>
                                <Accordion.Header>
                                    Order #{order._id} - {createdAt}
                                </Accordion.Header>
                                <Accordion.Body>
                                    {orderData ? (
                                        <>
                                            <p>
                                                <strong>Customer Name:</strong> {orderData.customer.firstName} {orderData.customer.lastName}
                                            </p>
                                            <p>
                                                <strong>Address:</strong> {address}
                                            </p>
                                            <h5>Items:</h5>
                                            {orderData.items && orderData.items.length > 0 ? (
                                                <ul>
                                                    {orderData.items.map((item, i) => (
                                                        <li key={i} className="order-list">
                                                            {item.name} – Quantity: {item.quantity} – Unit Price: $
                                                            {item.unitPrice !== undefined ? item.unitPrice.toFixed(2) : "0.00"}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No items found in this order.</p>
                                            )}
                                            <p>
                                                <strong>Total Price:</strong> ${orderData.totalPrice !== undefined ? orderData.totalPrice.toFixed(2) : "0.00"}
                                            </p>
                                            <p>
                                                <strong>Status:</strong> {orderData.status}
                                            </p>
                                        </>
                                    ) : (
                                        <p>No order data available.</p>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>
            )}
        </div>
    );
}
