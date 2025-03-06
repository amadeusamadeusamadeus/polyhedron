// routes/orders.js
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import { isEmail, isNotEmpty } from "../../client/src/utility/validation.js";
import { checkAuth } from "../util/auth.js";

const router = express.Router();

// GET a list of orders for the authenticated user.
router.get("/", checkAuth, async (req, res) => {
    try {
        // req.token is set by the checkAuth middleware
        const userEmail = req.token.email;
        const orders = await db.collection("orders").find({
            "orderData.customer.email": userEmail
        }).toArray();
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching orders");
    }
});

// GET a single order by id (ensure the order belongs to the authenticated user)
router.get("/:id", checkAuth, async (req, res) => {
    try {
        const userEmail = req.token.email;
        const query = {
            _id: new ObjectId(req.params.id),
            "orderData.customer.email": userEmail
        };
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
        // Ensure the order's customer email matches the authenticated user's email.
        if (order.customer.email !== req.token.email) {
            return res.status(403).send("Not authorized to create this order.");
        }
        // Optionally, you can add additional checks for items, totalPrice, createdAt, etc.
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
        const userEmail = req.token.email;
        // Expecting a payload with updated customer info (inside orderData.customer)
        const updatedCustomer = req.body.customer;
        if (!updatedCustomer || !updatedCustomer.email) {
            return res.status(400).send("Updated customer data is required.");
        }
        if (updatedCustomer.email !== userEmail) {
            return res.status(403).send("Not authorized to update this order.");
        }
        const query = {
            _id: new ObjectId(req.params.id),
            "orderData.customer.email": userEmail,
        };
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
        const userEmail = req.token.email;
        const query = {
            _id: new ObjectId(req.params.id),
            "orderData.customer.email": userEmail,
        };
        const result = await db.collection("orders").deleteOne(query);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting order");
    }
});

export default router;
