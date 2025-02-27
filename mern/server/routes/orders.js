import express from "express";
// This will help us connect to the database
import db from "../db/connection.js";
// This helps convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";
import validation from "./validation.js";

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
        const newDocument = {
            orderData: req.body.order
        };

        const {
            value: emailValue,
            handleInputChange: handleEmailChange,
            handleInputBlur: handleEmailBlur,
            hasError: emailHasError,
            reset: resetEmail
        } = useInput("", (value)=> isEmail(value) && isNotEmpty(value));

        //TODO: add checks for empty & data integrity

        // if (
        //     orderData.customer.email === null ||
        //     !orderData.customer.email.includes("@") ||
        //     ...||
        // )

        const collection = await db.collection("orders");
        const result = await collection.insertOne(newDocument);
        // Return 201 (Created) with the inserted document's info.
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding order");
    }
});

// Update an order by id.
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                username: req.body.username,
                email: req.body.email,
                address: req.body.address,
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
