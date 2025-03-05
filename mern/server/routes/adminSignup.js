import express from "express";
import db from "../db/connection.js";
import { hash } from "bcryptjs";

const router = express.Router();

// POST /admin/signup: Create an admin user, protected by a secret key.
router.post("/", async (req, res) => {
    try {
        const { email, password, secret } = req.body;

        // Check for required fields.
        if (!email || !password || !secret) {
            return res.status(400).json({ error: "Email, password, and secret are required." });
        }

        // Verify the secret matches an environment variable.
        if (secret !== process.env.ADMIN_SIGNUP_SECRET) {
            return res.status(403).json({ error: "Not authorized to register admin." });
        }

        // Check if the user already exists.
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(422).json({ error: "User already exists." });
        }

        // Hash the password.
        const hashedPassword = await hash(password, 12);

        // Create the new admin user with role "admin".
        const newUser = {
            email,
            password: hashedPassword,
            role: "admin"
            // Include any other fields as needed.
        };

        const result = await db.collection("users").insertOne(newUser);
        res.status(201).json({ message: "Admin created successfully.", userId: result.insertedId });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ error: "Error creating admin." });
    }
});

export default router;
