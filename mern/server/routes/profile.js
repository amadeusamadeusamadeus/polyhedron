// routes/profile.js
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * GET /users/profile/:id
 * Fetch a user's profile.
 */
router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const profile = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            street: user.street,
            streetNumber: user.streetNumber,
            postalCode: user.postalCode,
            city: user.city,
        };
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * PUT /users/profile/:id
 * Update a user's profile details (including role if provided).
 */
router.put("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, firstName, lastName, role, street, streetNumber, postalCode, city } = req.body;
        const updateResult = await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: { email, firstName, lastName, role, street, streetNumber, postalCode, city } }
        );
        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ error: "User not found or nothing was updated" });
        }
        const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        const profile = {
            _id: updatedUser._id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            role: updatedUser.role,
            street: updatedUser.street,
            streetNumber: updatedUser.streetNumber,
            postalCode: updatedUser.postalCode,
            city: updatedUser.city,
        };
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * PUT /users/profile/:id/password
 * Update a user's password.
 */
router.put("/:id/password", async (req, res) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword } = req.body;
        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Old password is incorrect" });
        }
        const hashedNewPassword = bcrypt.hashSync(newPassword, 12);
        const updateResult = await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: { password: hashedNewPassword } }
        );
        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ error: "Password update failed" });
        }
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * DELETE /users/profile/:id
 * Delete a user's profile.
 */
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const deleteResult = await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
