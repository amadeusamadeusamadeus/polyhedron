// routes/profile.js
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /users/profile/:id
router.get("/profile/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Return only the necessary profile fields
        const profile = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            address: {
                street: user.street,
                streetNumber: user.streetNumber,
                postalCode: user.postalCode,
                city: user.city,
            },
        };
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
