import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import { isEmail, isNotEmpty } from "../../client/src/utility/validation.js";

const router = express.Router();

// Get a list of all orders.
router.get("/", async (req, res) => {
    try {
        const collection = await db.collection("orders");
        const results = await collection.find({}).toArray();
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching orders");
    }
});

// Get a single order by id.
router.get("/:id", async (req, res) => {
    try {
        const collection = await db.collection("orders");
        const query = { _id: new ObjectId(req.params.id) };
        const result = await collection.findOne(query);
        if (!result) {
            res.status(404).send("Not found");
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching order");
    }
});

// Create a new order.
router.post("/", async (req, res) => {
    try {
        const order = req.body.order;
        // Validate that order data exists.
        if (!order) {
            return res.status(400).send("Order data is required.");
        }

        // Example: Assuming order.customer.email is required.
        if (!order.customer || !order.customer.email) {
            return res.status(400).send("Customer email is required.");
        }
        if (!isNotEmpty(order.customer.email)) {
            return res.status(400).send("Customer email cannot be empty.");
        }
        if (!isEmail(order.customer.email)) {
            return res.status(400).send("Customer email is invalid.");
        }

        // TODO: Add additional validation for other required fields here.

        const newDocument = {
            orderData: order
        };

        const collection = await db.collection("orders");
        const result = await collection.insertOne(newDocument);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding order");
    }
});

// Update an order by id.
router.patch("/:id", async (req, res) => {
    try {
        // Validate required fields for update.
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

        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                username,
                email,
                address,
            },
        };

        const collection = await db.collection("orders");
        const result = await collection.updateOne(query, updates);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating order");
    }
});

// Delete an order by id.
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const collection = await db.collection("orders");
        const result = await collection.deleteOne(query);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting order");
    }
});

export default router;
