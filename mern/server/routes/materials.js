// routes/materials.js
import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// GET /materials - Returns all materials from the DB.
router.get("/", async (req, res) => {
    try {
        const materials = await db.collection("products_materials").find({}).toArray();
        res.status(200).json(materials);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching materials" });
    }
});

// POST /materials - Create a material record if not already in the DB.
router.post("/", async (req, res) => {
    try {
        const { uuid, name, priceModifier, icon } = req.body;
        if (!uuid) {
            return res.status(400).json({ error: "uuid is required" });
        }
        // Check if the material already exists.
        const existing = await db.collection("products.materials").findOne({ uuid });
        if (existing) {
            return res.status(200).json(existing);
        }
        const newMaterial = {
            uuid,
            name: name || "Placeholder Material",
            priceModifier: priceModifier !== undefined ? priceModifier : 0,
            icon: icon || ""
        };
        const result = await db.collection("products.materials").insertOne(newMaterial);
        res.status(201).json({ ...newMaterial, _id: result.insertedId });
    } catch (error) {
        console.error("Error creating material:", error);
        res.status(500).json({ error: "Failed to create material" });
    }
});

export default router;
