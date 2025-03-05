// src/components/AdminSignupForm.jsx
import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";

export default function AdminSignupForm() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        secret: ""
    });

    function handleChange(e) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:5050/admin/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Signup failed");
                setIsSubmitting(false);
                return;
            }

            const data = await response.json();
            setSuccess("Admin account created successfully!");
            // Optionally redirect to login or home page after signup:
        } catch (err) {
            console.error("Error during admin signup:", err);
            setError("Error during signup. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Admin Signup</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <div>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Secret Key</label>
                <input
                    name="secret"
                    type="text"
                    value={formData.secret}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="button">
                {isSubmitting ? "Submitting..." : "Sign Up as Admin"}
            </button>
        </Form>
    );
}
