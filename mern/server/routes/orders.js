// routes/orders.js
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import { isEmail, isNotEmpty } from "../../client/src/utility/validation.js";
import { checkAuth } from "../util/auth.js"; // Ensure this is the ES module version of your auth middleware

const router = express.Router();

// GET a list of orders for the authenticated user.
router.get("/", checkAuth, async (req, res) => {
    try {
        // req.token is assumed to be set by checkAuth middleware
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
            res.status(404).send("Not found or not authorized");
        } else {
            res.status(200).json(order);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching order");
    }
});

// POST: Create a new order (optionally, you may enforce that the orderData.customer.email matches the authenticated user)
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
        // Optionally ensure the order's customer email matches the authenticated user's email.
        if (order.customer.email !== req.token.email) {
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

// PATCH: Update an order by id (verify the authenticated user owns the order)
router.patch("/:id", checkAuth, async (req, res) => {
    try {
        const userEmail = req.token.email;
        const { username, email, address } = req.body;
        if (!username || !isNotEmpty(username)) {
            return res.status(400).send("Username is required.");
        }
        if (!email || !isNotEmpty(email)) {
            return res.status(400).send("Email is required.");
        }
        if (!isEmail(email)) {
            return res.status(400).send("Invalid email.");
        }
        if (!address || !isNotEmpty(address)) {
            return res.status(400).send("Address is required.");
        }

        // Ensure the order belongs to the authenticated user.
        const query = {
            _id: new ObjectId(req.params.id),
            "orderData.customer.email": userEmail
        };
        const updates = {
            $set: {
                username,
                email,
                address
            }
        };

        const result = await db.collection("orders").updateOne(query, updates);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating order");
    }
});

// DELETE: Delete an order by id (only if it belongs to the authenticated user)
router.delete("/:id", checkAuth, async (req, res) => {
    try {
        const userEmail = req.token.email;
        const query = {
            _id: new ObjectId(req.params.id),
            "orderData.customer.email": userEmail
        };
        const result = await db.collection("orders").deleteOne(query);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting order");
    }
});

export default router;
