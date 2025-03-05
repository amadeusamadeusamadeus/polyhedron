// src/pages/Orders.jsx
import React, { useContext, useEffect, useState } from "react";
import { Accordion, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../store/AuthContext.jsx";

//TODO: Proper error messages for whether user isn't signed in or they might not have orders yet
//TODO: fix proper formatting and data integrity once established

export default function Orders() {
    const { token, isAuthenticated } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrders() {
            // If not authenticated, display an error.
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
                    {orders.map((order, index) => (
                        <Accordion.Item eventKey={index.toString()} key={order._id}>
                            <Accordion.Header>
                                Order #{order._id} -{" "}
                                {order.orderData && order.orderData.customer
                                    ? order.orderData.customer.email
                                    : "No customer info"}
                            </Accordion.Header>
                            <Accordion.Body>
                                {order.orderData ? (
                                    <>
                                        <p>
                                            <strong>Customer Name:</strong>{" "}
                                            {order.orderData.customer.firstName}{" "}
                                            {order.orderData.customer.lastName}
                                        </p>
                                        <p>
                                            <strong>Email:</strong>{" "}
                                            {order.orderData.customer.email}
                                        </p>
                                        <p>
                                            <strong>Address:</strong>{" "}
                                            {order.orderData.customer.address}
                                        </p>
                                        <h5>Items:</h5>
                                        {order.orderData.items && order.orderData.items.length > 0 ? (
                                            <ul>
                                                {order.orderData.items.map((item, i) => (
                                                    <li key={i}>
                                                        {item.name} – Quantity: {item.quantity} – Price: $
                                                        {item.price.toFixed(2)}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No items found in this order.</p>
                                        )}
                                    </>
                                ) : (
                                    <p>No order data available.</p>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </div>
    );
}
