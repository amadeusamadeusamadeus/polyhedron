import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /shapes - Retrieve all shapes
router.get("/", async (req, res) => {
    try {
        const shapes = await db.collection("products.shapes").find({}).toArray();
        res.status(200).json(shapes);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching shapes");
    }
});

// GET /shapes/:id - Retrieve a single shape by its id
router.get("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const shape = await db.collection("products.shapes").findOne(query);
        if (!shape) {
            res.status(404).send("Shape not found");
        } else {
            res.status(200).json(shape);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching shape");
    }
});

export default router;
