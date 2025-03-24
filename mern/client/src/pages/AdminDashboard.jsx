// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { Accordion, Spinner, Alert, Form } from "react-bootstrap";
import { AuthContext } from "../store/AuthContext.jsx";
import Button from "../components/UI/Button.jsx";

function AdminDashboard() {
    const { token } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("users");

    return (
        <div className="admin-dashboard container my-4">
            <h2 className="text-center">DASHBOARD</h2>
            <div className="admin-menu mb-4 text-center">
                <Button
                    variant="primary"
                    onClick={() => setActiveTab("users")}
                    isActive={activeTab === "users"}
                >
                    Users
                </Button>{" "}
                <Button
                    variant="primary"
                    onClick={() => setActiveTab("orders")}
                    isActive={activeTab === "orders"}
                >
                    Orders
                </Button>{" "}
                <Button
                    variant="primary"
                    onClick={() => setActiveTab("shapes")}
                    isActive={activeTab === "shapes"}
                >
                    Product Shapes
                </Button>{" "}
                <Button
                    variant="primary"
                    onClick={() => setActiveTab("materials")}
                    isActive={activeTab === "materials"}
                >
                    Product Materials
                </Button>
            </div>
            <div className="admin-content">
                {activeTab === "users" && <AdminUsers token={token} />}
                {activeTab === "orders" && <AdminOrders token={token} />}
                {activeTab === "shapes" && <AdminProductShapes token={token} />}
                {activeTab === "materials" && <AdminProductMaterials token={token} />}
            </div>
        </div>
    );
}

function AdminUsers({ token }) {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = () => {
        fetch("http://localhost:5050/users", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch users");
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const startEditing = (user) => {
        setEditingUserId(user._id);
        setEditForm({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            street: user.street || "",
            streetNumber: user.streetNumber || "",
            postalCode: user.postalCode || "",
            city: user.city || "",
            role: user.role,
        });
    };

    const cancelEditing = () => {
        setEditingUserId(null);
        setEditForm({});
    };

    const saveUser = (userId) => {
        fetch(`http://localhost:5050/users/profile/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editForm),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update user");
                return res.json();
            })
            .then((updatedUser) => {
                setUsers((prev) =>
                    prev.map((user) => (user._id === userId ? updatedUser : user))
                );
                setEditingUserId(null);
            })
            .catch((err) => {
                alert("Error updating user: " + err.message);
            });
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div>
            <h3>All Users</h3>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <Accordion defaultActiveKey="0">
                    {users.map((user, index) => (
                        <Accordion.Item eventKey={index.toString()} key={user._id}>
                            <Accordion.Header>
                                {user.email} - {user.firstName} {user.lastName}
                            </Accordion.Header>
                            <Accordion.Body>
                                {editingUserId === user._id ? (
                                    <Form>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, email: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editForm.firstName}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, firstName: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editForm.lastName}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, lastName: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Street</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editForm.street}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, street: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Street Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editForm.streetNumber}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, streetNumber: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Postal Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editForm.postalCode}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, postalCode: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editForm.city}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, city: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Role</Form.Label>
                                            <Form.Select
                                                value={editForm.role}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, role: e.target.value })
                                                }
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Button
                                            variant="success"
                                            onClick={() => saveUser(user._id)}
                                            className="me-2"
                                        >
                                            Save
                                        </Button>
                                        <Button variant="secondary" onClick={cancelEditing}>
                                            Cancel
                                        </Button>
                                    </Form>
                                ) : (
                                    <div>
                                        <p>
                                            <strong>ID:</strong> {user._id}
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {user.email}
                                        </p>
                                        <p>
                                            <strong>Name:</strong> {user.firstName} {user.lastName}
                                        </p>
                                        <p>
                                            <strong>Address:</strong> {user.street} {user.streetNumber},{" "}
                                            {user.postalCode} {user.city}
                                        </p>
                                        <p>
                                            <strong>Role:</strong> {user.role}
                                        </p>
                                        <Button
                                            variant="primary"
                                            onClick={() => startEditing(user)}
                                            className="mt-2"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </div>
    );
}

function AdminOrders({ token }) {
    const [orders, setOrders] = useState([]);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [orderEditForm, setOrderEditForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const orderStatusOptions = ["Ordered", "In Delivery", "Delivered", "Cancelled"];

    const fetchOrders = () => {
        fetch("http://localhost:5050/orders", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch orders");
                return res.json();
            })
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const startEditing = (order) => {
        setEditingOrderId(order._id);
        const customer = order.orderData?.customer || {};
        const address = customer.address || {};
        setOrderEditForm({
            status: order.orderData?.status || "Ordered",
            firstName: customer.firstName || "",
            lastName: customer.lastName || "",
            street: address.street || "",
            streetNumber: address.streetNumber || "",
            postalCode: address.postalCode || "",
            city: address.city || "",
            totalPrice: order.orderData?.totalPrice || 0,
        });
    };

    const cancelEditing = () => {
        setEditingOrderId(null);
        setOrderEditForm({});
    };

    const saveOrder = (orderId) => {
        const originalOrder = orders.find((order) => order._id === orderId);
        const updatedOrderData = {
            ...originalOrder.orderData,
            status: orderEditForm.status,
            customer: {
                ...originalOrder.orderData.customer,
                firstName: orderEditForm.firstName,
                lastName: orderEditForm.lastName,
                address: {
                    street: orderEditForm.street,
                    streetNumber: orderEditForm.streetNumber,
                    postalCode: orderEditForm.postalCode,
                    city: orderEditForm.city,
                },
            },
            totalPrice: parseFloat(orderEditForm.totalPrice),
        };

        fetch(`http://localhost:5050/orders/${orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderData: updatedOrderData }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update order");
                return res.json();
            })
            .then((updatedOrder) => {
                setOrders((prev) =>
                    prev.map((order) => (order._id === orderId ? updatedOrder : order))
                );
                setEditingOrderId(null);
            })
            .catch((err) => {
                alert("Error updating order: " + err.message);
            });
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div>
            <h3>All Orders</h3>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <Accordion defaultActiveKey="0">
                    {orders.map((order, index) => {
                        const orderData = order.orderData || {};
                        const createdAt = orderData.createdAt
                            ? new Date(orderData.createdAt).toLocaleString()
                            : "No date";
                        const customer = orderData.customer || {};
                        const address = customer.address
                            ? `${customer.address.street} ${customer.address.streetNumber}, ${customer.address.postalCode} ${customer.address.city}`
                            : "No address";
                        return (
                            <Accordion.Item eventKey={index.toString()} key={order._id}>
                                <Accordion.Header>
                                    Order #{order._id} - {createdAt}
                                </Accordion.Header>
                                <Accordion.Body>
                                    {editingOrderId === order._id ? (
                                        <Form>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select
                                                    value={orderEditForm.status}
                                                    onChange={(e) =>
                                                        setOrderEditForm({ ...orderEditForm, status: e.target.value })
                                                    }
                                                >
                                                    {orderStatusOptions.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Customer First Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={orderEditForm.firstName}
                                                    onChange={(e) =>
                                                        setOrderEditForm({ ...orderEditForm, firstName: e.target.value })
                                                    }
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Customer Last Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={orderEditForm.lastName}
                                                    onChange={(e) =>
                                                        setOrderEditForm({ ...orderEditForm, lastName: e.target.value })
                                                    }
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Street</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={orderEditForm.street}
                                                    onChange={(e) =>
                                                        setOrderEditForm({ ...orderEditForm, street: e.target.value })
                                                    }
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Street Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={orderEditForm.streetNumber}
                                                    onChange={(e) =>
                                                        setOrderEditForm({ ...orderEditForm, streetNumber: e.target.value })
                                                    }
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Postal Code</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={orderEditForm.postalCode}
                                                    onChange={(e) =>
                                                        setOrderEditForm({ ...orderEditForm, postalCode: e.target.value })
                                                    }
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>City</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={orderEditForm.city}
                                                    onChange={(e) =>
                                                        setOrderEditForm({ ...orderEditForm, city: e.target.value })
                                                    }
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Total Price</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    step="0.01"
                                                    value={orderEditForm.totalPrice}
                                                    onChange={(e) =>
                                                        setOrderEditForm({ ...orderEditForm, totalPrice: e.target.value })
                                                    }
                                                />
                                            </Form.Group>
                                            <Button variant="success" onClick={() => saveOrder(order._id)} className="me-2">
                                                Save
                                            </Button>
                                            <Button variant="secondary" onClick={cancelEditing}>
                                                Cancel
                                            </Button>
                                        </Form>
                                    ) : (
                                        <div>
                                            {orderData ? (
                                                <>
                                                    <p>
                                                        <strong>Customer Name:</strong> {customer.firstName} {customer.lastName}
                                                    </p>
                                                    <p>
                                                        <strong>Address:</strong> {address}
                                                    </p>
                                                    <h5>Items:</h5>
                                                    {orderData.items && orderData.items.length > 0 ? (
                                                        <ul>
                                                            {orderData.items.map((item, i) => (
                                                                <li key={i}>
                                                                    {item.quantity} x {item.shape} Material: {item.material} – Unit Price: $
                                                                    {item.unitPrice !== undefined ? item.unitPrice.toFixed(2) : "0.00"}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No items found in this order.</p>
                                                    )}
                                                    <p>
                                                        <strong>Total Price:</strong> $
                                                        {orderData.totalPrice !== undefined ? orderData.totalPrice.toFixed(2) : "0.00"}
                                                    </p>
                                                    <p>
                                                        <strong>Status:</strong> {orderData.status}
                                                    </p>
                                                </>
                                            ) : (
                                                <p>No order data available.</p>
                                            )}
                                            <Button variant="primary" onClick={() => startEditing(order)} className="mt-2">
                                                Edit
                                            </Button>
                                        </div>
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

function AdminProductShapes({ token }) {
    const [shapes, setShapes] = useState([]);
    const [editingShapeId, setEditingShapeId] = useState(null);
    const [editShapeForm, setEditShapeForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchShapes = () => {
        fetch("http://localhost:5050/shapes", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch shapes");
                return res.json();
            })
            .then((data) => {
                setShapes(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchShapes();
    }, [token]);

    const startEditing = (shape) => {
        setEditingShapeId(shape._id);
        setEditShapeForm({
            name: shape.name,
            modelUrl: shape.modelUrl,
            basePrice: shape.basePrice,
        });
    };

    const cancelEditing = () => {
        setEditingShapeId(null);
        setEditShapeForm({});
    };

    const saveShape = (shapeId) => {
        fetch(`http://localhost:5050/shapes/${shapeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editShapeForm),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update shape");
                return res.json();
            })
            .then((updatedShape) => {
                setShapes((prev) =>
                    prev.map((shape) => (shape._id === shapeId ? updatedShape : shape))
                );
                setEditingShapeId(null);
            })
            .catch((err) => {
                alert("Error updating shape: " + err.message);
            });
    };

    const handleAddShape = (e) => {
        e.preventDefault();
        const payload = {
            name: e.target.name.value,
            modelUrl: e.target.modelUrl.value,
            basePrice: parseFloat(e.target.basePrice.value),
        };
        fetch("http://localhost:5050/shapes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to add shape");
                return res.json();
            })
            .then((newShape) => {
                setShapes((prev) => [...prev, newShape]);
                e.target.reset();
            })
            .catch((err) => {
                alert("Error adding shape: " + err.message);
            });
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div>
            <h3>Product Shapes</h3>
            <Form onSubmit={handleAddShape}>
                <Form.Group className="mb-2" controlId="shapeName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" required />
                </Form.Group>
                <Form.Group className="mb-2" controlId="shapeModelUrl">
                    <Form.Label>Model URL</Form.Label>
                    <Form.Control type="text" name="modelUrl" required />
                </Form.Group>
                <Form.Group className="mb-2" controlId="shapeBasePrice">
                    <Form.Label>Base Price</Form.Label>
                    <Form.Control type="number" step="0.01" name="basePrice" required />
                </Form.Group>
                <Button type="submit" variant="success">
                    Add Shape
                </Button>
            </Form>
            <hr />
            <h4>Existing Shapes</h4>
            {shapes.length === 0 ? (
                <p>No shapes available.</p>
            ) : (
                <ul>
                    {shapes.map((shape) => (
                        <li key={shape._id}>
                            {editingShapeId === shape._id ? (
                                <Form>
                                    <Form.Control
                                        type="text"
                                        value={editShapeForm.name}
                                        onChange={(e) =>
                                            setEditShapeForm({ ...editShapeForm, name: e.target.value })
                                        }
                                        className="me-2"
                                    />
                                    <Form.Control
                                        type="text"
                                        value={editShapeForm.modelUrl}
                                        onChange={(e) =>
                                            setEditShapeForm({ ...editShapeForm, modelUrl: e.target.value })
                                        }
                                        className="me-2"
                                    />
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={editShapeForm.basePrice}
                                        onChange={(e) =>
                                            setEditShapeForm({
                                                ...editShapeForm,
                                                basePrice: parseFloat(e.target.value),
                                            })
                                        }
                                        className="me-2"
                                    />
                                    <Button variant="success" onClick={() => saveShape(shape._id)} className="me-2">
                                        Save
                                    </Button>
                                    <Button variant="secondary" onClick={cancelEditing}>
                                        Cancel
                                    </Button>
                                </Form>
                            ) : (
                                <div>
                                    {shape.name} - ${parseFloat(shape.basePrice).toFixed(2)}
                                    <Button variant="primary" size="sm" onClick={() => startEditing(shape)} className="ms-2">
                                        Edit
                                    </Button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function AdminProductMaterials({ token }) {
    const [materials, setMaterials] = useState([]);
    const [editingMaterialId, setEditingMaterialId] = useState(null);
    const [editMaterialForm, setEditMaterialForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMaterials = () => {
        fetch("http://localhost:5050/materials", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch materials");
                return res.json();
            })
            .then((data) => {
                setMaterials(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMaterials();
    }, [token]);

    const startEditing = (material) => {
        setEditingMaterialId(material._id);
        setEditMaterialForm({
            uuid: material.uuid,
            name: material.name,
            priceModifier: material.priceModifier,
            icon: material.icon,
        });
    };

    const cancelEditing = () => {
        setEditingMaterialId(null);
        setEditMaterialForm({});
    };

    const saveMaterial = (materialId) => {
        fetch(`http://localhost:5050/materials/${materialId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editMaterialForm),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update material");
                return res.json();
            })
            .then((updatedMaterial) => {
                setMaterials((prev) =>
                    prev.map((mat) => (mat._id === materialId ? updatedMaterial : mat))
                );
                setEditingMaterialId(null);
            })
            .catch((err) => {
                alert("Error updating material: " + err.message);
            });
    };

    const handleAddMaterial = (e) => {
        e.preventDefault();
        const payload = {
            uuid: e.target.uuid.value,
            name: e.target.name.value,
            priceModifier: parseFloat(e.target.priceModifier.value),
            icon: e.target.icon.value,
        };
        fetch("http://localhost:5050/materials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to add material");
                return res.json();
            })
            .then((newMaterial) => {
                setMaterials((prev) => [...prev, newMaterial]);
                e.target.reset();
            })
            .catch((err) => {
                alert("Error adding material: " + err.message);
            });
    };

    const handleDeleteMaterial = (materialId) => {
        if (!window.confirm("Are you sure you want to delete this material?")) return;
        fetch(`http://localhost:5050/materials/${materialId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete material");
                return res.json();
            })
            .then(() => {
                setMaterials((prev) => prev.filter((mat) => mat._id !== materialId));
            })
            .catch((err) => {
                alert("Error deleting material: " + err.message);
            });
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div>
            <h3>Product Materials</h3>
            <Form onSubmit={handleAddMaterial}>
                <Form.Group className="mb-2" controlId="materialUuid">
                    <Form.Label>UUID</Form.Label>
                    <Form.Control type="text" name="uuid" required />
                </Form.Group>
                <Form.Group className="mb-2" controlId="materialName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" required />
                </Form.Group>
                <Form.Group className="mb-2" controlId="materialPriceModifier">
                    <Form.Label>Price Modifier</Form.Label>
                    <Form.Control type="number" step="0.01" name="priceModifier" required />
                </Form.Group>
                <Form.Group className="mb-2" controlId="materialIcon">
                    <Form.Label>Icon URL</Form.Label>
                    <Form.Control type="text" name="icon" required />
                </Form.Group>
                <Button type="submit" variant="success">
                    Add Material
                </Button>
            </Form>
            <hr />
            <h4>Existing Materials</h4>
            {materials.length === 0 ? (
                <p>No materials available.</p>
            ) : (
                <ul className="admin-materials-ul">
                    {materials.map((material) => (
                        <li key={material._id}>
                            {editingMaterialId === material._id ? (
                                <Form>
                                    <Form.Control
                                        type="text"
                                        value={editMaterialForm.uuid}
                                        onChange={(e) =>
                                            setEditMaterialForm({ ...editMaterialForm, uuid: e.target.value })
                                        }
                                        className="me-2"
                                    />
                                    <Form.Control
                                        type="text"
                                        value={editMaterialForm.name}
                                        onChange={(e) =>
                                            setEditMaterialForm({ ...editMaterialForm, name: e.target.value })
                                        }
                                        className="me-2"
                                    />
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={editMaterialForm.priceModifier}
                                        onChange={(e) =>
                                            setEditMaterialForm({ ...editMaterialForm, priceModifier: parseFloat(e.target.value) })
                                        }
                                        className="me-2"
                                    />
                                    <Form.Control
                                        type="text"
                                        value={editMaterialForm.icon}
                                        onChange={(e) =>
                                            setEditMaterialForm({ ...editMaterialForm, icon: e.target.value })
                                        }
                                        className="me-2"
                                    />
                                    <Button variant="success" onClick={() => saveMaterial(material._id)} className="me-2">
                                        Save
                                    </Button>
                                    <Button variant="secondary" onClick={cancelEditing}>
                                        Cancel
                                    </Button>
                                </Form>
                            ) : (
                                <div>
                                    {material.name} (Modifier: {material.priceModifier})
                                    <Button variant="primary" size="sm" onClick={() => startEditing(material)} className="ms-2">
                                        Edit
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteMaterial(material._id)} className="ms-2">
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminDashboard;
