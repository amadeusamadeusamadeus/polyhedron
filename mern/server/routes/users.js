// routes/users.js
import express from "express";
import db from "../db/connection.js";

const router = express.Router();

/**
 * GET /users
 * Retrieve all users (without sensitive fields like passwords).
 */
router.get("/", async (req, res) => {
    try {
        const users = await db.collection("users").find({}).toArray();
        const safeUsers = users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
        res.status(200).json(safeUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
