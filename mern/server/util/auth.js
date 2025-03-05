// server/util/auth.js
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import { compare } from "bcryptjs";

// Your secret key from environment variables.
const KEY = process.env.KEY;

// Create a JSON Web Token that includes user data.
export function createJSONToken(user) {
    return sign({ email: user.email, id: user._id, role: user.role }, KEY, {
        expiresIn: "1h"
    });
}

// Validate a JSON Web Token.
export function validateJSONToken(token) {
    return verify(token, KEY);
}

// Validate a plaintext password against a hashed password.
export async function isValidPassword(plaintextPassword, hashedPassword) {
    return await compare(plaintextPassword, hashedPassword);
}

// Authentication middleware to check the token.
export function checkAuth(req, res, next) {
    if (req.method === "OPTIONS") return next();
    if (!req.headers.authorization) {
        console.log("NOT AUTH. AUTH HEADER MISSING.");
        return res.status(401).json({ error: "Not authenticated." });
    }
    const authFragments = req.headers.authorization.split(" ");
    if (authFragments.length !== 2) {
        console.log("NOT AUTH. AUTH HEADER INVALID.");
        return res.status(401).json({ error: "Not authenticated." });
    }
    const token = authFragments[1];
    try {
        const validated = validateJSONToken(token);
        req.token = validated;
    } catch (error) {
        console.log("NOT AUTH. TOKEN INVALID.");
        return res.status(401).json({ error: "Not authenticated." });
    }
    next();
}
