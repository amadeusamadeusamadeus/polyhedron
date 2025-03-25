// routes/shapes.js
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * GET /shapes
 * Retrieve all product shapes.
 */
router.get("/", async (req, res) => {
    try {
        const shapes = await db.collection("products.shapes").find({}).toArray();
        res.status(200).json(shapes);
    } catch (err) {
        console.error("Error fetching shapes:", err);
        res.status(500).json({ error: "Error fetching shapes" });
    }
});

/**
 * GET /shapes/:id
 * Retrieve a single shape by its id.
 */
router.get("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const shape = await db.collection("products.shapes").findOne(query);
        if (!shape) {
            return res.status(404).json({ error: "Shape not found" });
        }
        res.status(200).json(shape);
    } catch (err) {
        console.error("Error fetching shape:", err);
        res.status(500).json({ error: "Error fetching shape" });
    }
});

/**
 * POST /shapes
 * Add a new product shape.
 */
router.post("/", async (req, res) => {
    try {
        const { name, modelUrl, basePrice, icon } = req.body;
        if (!name || !modelUrl || !icon || basePrice === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const newShape = {
            name,
            modelUrl,
            basePrice: parseFloat(basePrice),
            icon,
        };
        const result = await db.collection("products.shapes").insertOne(newShape);
        newShape._id = result.insertedId;
        res.status(201).json(newShape);
    } catch (err) {
        console.error("Error adding new shape:", err);
        res.status(500).json({ error: "Error adding new shape" });
    }
});

/**
 * PUT /shapes/:id
 * Update an existing product shape.
 */
router.put("/:id", async (req, res) => {
    try {
        const shapeId = req.params.id;
        const { name, modelUrl, basePrice, icon } = req.body;
        const updateResult = await db.collection("products.shapes").updateOne(
            { _id: new ObjectId(shapeId) },
            { $set: { name, modelUrl, basePrice: parseFloat(basePrice), icon } }
        );
        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ error: "Shape not found or nothing updated" });
        }
        const updatedShape = await db.collection("products.shapes").findOne({ _id: new ObjectId(shapeId) });
        res.status(200).json(updatedShape);
    } catch (err) {
        console.error("Error updating shape:", err);
        res.status(500).json({ error: "Error updating shape" });
    }
});

export default router;
