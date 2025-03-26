// routes/orders.js
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import { isEmail, isNotEmpty } from "../../client/src/utility/validation.js";
import { checkAuth } from "../util/auth.js";

const router = express.Router();

// GET a list of orders for the authenticated user or all orders for admin.
router.get("/", checkAuth, async (req, res) => {
    try {
        const { email, role } = req.token;
        let query = {};
        if (role !== "admin") {
            query = { "orderData.customer.email": email };
        }
        const orders = await db.collection("orders").find(query).toArray();
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching orders");
    }
});

// GET a single order by id (ensure the order belongs to the authenticated user unless admin)
router.get("/:id", checkAuth, async (req, res) => {
    try {
        const { email, role } = req.token;
        const query = { _id: new ObjectId(req.params.id) };
        if (role !== "admin") {
            query["orderData.customer.email"] = email;
        }
        const order = await db.collection("orders").findOne(query);
        if (!order) {
            return res.status(404).send("Not found or not authorized");
        }
        res.status(200).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching order");
    }
});

// POST: Create a new order.
router.post("/", checkAuth, async (req, res) => {
    try {
        const order = req.body.order;
        if (!order) {
            return res.status(400).send("Order data is required.");
        }
        if (!order.customer || !order.customer.email) {
            return res.status(400).send("Customer email is required.");
        }
        if (!isNotEmpty(order.customer.email)) {
            return res.status(400).send("Customer email cannot be empty.");
        }
        if (!isEmail(order.customer.email)) {
            return res.status(400).send("Customer email is invalid.");
        }
        // Ensure the order's customer email matches the authenticated user's email
        // (unless the user is admin, though typically only regular users create orders)
        if (req.token.role !== "admin" && order.customer.email !== req.token.email) {
            return res.status(403).send("Not authorized to create this order.");
        }
        const newDocument = { orderData: order };
        const result = await db.collection("orders").insertOne(newDocument);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding order");
    }
});

// PATCH: Update customer information in an order by id.
router.patch("/:id", checkAuth, async (req, res) => {
    try {
        const { email, role } = req.token;
        // Expecting a payload with updated customer info (inside orderData.customer)
        const updatedCustomer = req.body.customer;
        if (!updatedCustomer || !updatedCustomer.email) {
            return res.status(400).send("Updated customer data is required.");
        }
        if (role !== "admin" && updatedCustomer.email !== email) {
            return res.status(403).send("Not authorized to update this order.");
        }
        const query = { _id: new ObjectId(req.params.id) };
        if (role !== "admin") {
            query["orderData.customer.email"] = email;
        }
        const updates = {
            $set: {
                "orderData.customer": updatedCustomer,
            },
        };
        const result = await db.collection("orders").updateOne(query, updates);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating order");
    }
});

// DELETE: Delete an order by id.
router.delete("/:id", checkAuth, async (req, res) => {
    try {
        const { email, role } = req.token;
        const query = { _id: new ObjectId(req.params.id) };
        if (role !== "admin") {
            query["orderData.customer.email"] = email;
        }
        const result = await db.collection("orders").deleteOne(query);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting order");
    }
});

router.put("/:id", checkAuth, async (req, res) => {
    try {
        const { email, role } = req.token;
        // Expect full order data in req.body.order
        const order = req.body.orderData;
        if (!order) {
            return res.status(400).send("Order data is required.");
        }
        // For non-admins, ensure the customer email matches
        if (role !== "admin" && (!order.customer || order.customer.email !== email)) {
            return res.status(403).send("Not authorized to update this order.");
        }
        const query = { _id: new ObjectId(req.params.id) };
        if (role !== "admin") {
            query["orderData.customer.email"] = email;
        }
        const updateDoc = { $set: { orderData: order } };
        const result = await db.collection("orders").updateOne(query, updateDoc);
        if (result.matchedCount === 0) {
            return res.status(404).send("Order not found.");
        }
        // Even if modifiedCount is 0, the order exists—return the current order.
        const updatedOrder = await db.collection("orders").findOne({ _id: new ObjectId(req.params.id) });
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating order");
    }
});

export default router;
