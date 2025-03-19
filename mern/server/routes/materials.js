// routes/materials.js
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const materials = await db.collection("products.materials").find({}).toArray();
        res.status(200).json(materials);
    } catch (err) {
        console.error("Error fetching materials:", err);
        res.status(500).json({ error: "Error fetching materials" });
    }
});

/**
 * POST /materials
 * Create a material record if not already in the DB.
 */
router.post("/", async (req, res) => {
    try {
        const { uuid, name, priceModifier, icon } = req.body;
        if (!uuid) {
            return res.status(400).json({ error: "uuid is required" });
        }
        const existing = await db.collection("products.materials").findOne({ uuid });
        if (existing) {
            return res.status(200).json(existing);
        }
        const newMaterial = {
            uuid,
            name: name || "Placeholder Material",
            priceModifier: priceModifier !== undefined ? priceModifier : 15,
            icon: icon || ""
        };
        const result = await db.collection("products.materials").insertOne(newMaterial);
        res.status(201).json({ ...newMaterial, _id: result.insertedId });
    } catch (error) {
        console.error("Error creating material:", error);
        res.status(500).json({ error: "Failed to create material" });
    }
});

/**
 * PUT /materials/:id
 * Update an existing product material.
 */
router.put("/:id", async (req, res) => {
    try {
        const materialId = req.params.id;
        const { uuid, name, priceModifier, icon } = req.body;
        const updateResult = await db.collection("products.materials").updateOne(
            { _id: new ObjectId(materialId) },
            { $set: { uuid, name, priceModifier, icon } }
        );
        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ error: "Material not found or nothing updated" });
        }
        const updatedMaterial = await db.collection("products.materials").findOne({ _id: new ObjectId(materialId) });
        res.status(200).json(updatedMaterial);
    } catch (err) {
        console.error("Error updating material:", err);
        res.status(500).json({ error: "Error updating material" });
    }
});

/**
 * DELETE /materials/:id
 * Delete a product material.
 */
router.delete("/:id", async (req, res) => {
    try {
        const materialId = req.params.id;
        const result = await db.collection("products.materials").deleteOne({ _id: new ObjectId(materialId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Material not found" });
        }
        res.status(200).json({ message: "Material deleted successfully" });
    } catch (err) {
        console.error("Error deleting material:", err);
        res.status(500).json({ error: "Error deleting material" });
    }
});

export default router;
