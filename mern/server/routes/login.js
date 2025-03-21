// routes/login.js
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import pkg from "jsonwebtoken"; // Import the CommonJS module as default
const { sign } = pkg;
import { compare } from "bcryptjs";

// Ensure you have your secret key in your environment variables.
const KEY = process.env.KEY;

// Helper function to create a JSON Web Token.
function createJSONToken(user) {
    return sign({ email: user.email, id: user._id, role: user.role }, KEY, { expiresIn: "1h" });
}

// Helper function to validate password using bcryptjs
async function isValidPassword(plaintextPassword, hashedPassword) {
    return await compare(plaintextPassword, hashedPassword);
}

const router = express.Router();

// POST /login: Authenticate a user and return a JSON Web Token.
router.post("/", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await db.collection("users").findOne({ email });
        if (!user) {
            // No user found.
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Validate the password using bcryptjs's compare.
        const valid = await isValidPassword(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Create a JSON Web Token (JWT) that expires in 1 hour.
        const token = createJSONToken(user); // create token with full user info
        res.status(200).json({
            token,
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        });
    } catch (error) {
        console.error("Error during login:", error);
        next(error);
    }
});

export default router;
