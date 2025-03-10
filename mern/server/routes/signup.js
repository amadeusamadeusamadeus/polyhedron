// routes/signup.js
import express from "express";
import db from "../db/connection.js";
import { hash } from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            street,
            streetNumber,
            city,
            postalCode,
        } = req.body;

        // Validate required fields
        if (!email || !password || !firstName || !lastName || !street || !streetNumber || !city) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if the user already exists
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(422).json({ error: "User already exists." });
        }

        // Hash the password with 12 salt rounds
        const hashedPassword = await hash(password, 12);

        // Create new user document with role "user"
        const newUser = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            street,
            streetNumber,
            city,
            postalCode,
            role: "user"
        };

        const result = await db.collection("users").insertOne(newUser);
        res.status(201).json({ message: "User created successfully.", userId: result.insertedId });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Signup failed." });
    }
});

export default router;
