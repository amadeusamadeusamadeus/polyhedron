// src/components/SignupForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./UI/Button.jsx";
import { isEmail, isNotEmpty, hasMinLength } from "../utility/validation.js";
import { useInput } from "../hooks/useInput.js";
import { toast } from "react-toastify";

export default function SignupForm() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Using useInput for each field with appropriate validators
    const emailInput = useInput("", isEmail);
    const passwordInput = useInput("", (value) => hasMinLength(value, 6));
    const confirmPasswordInput = useInput("", isNotEmpty);
    const firstNameInput = useInput("", isNotEmpty);
    const lastNameInput = useInput("", isNotEmpty);
    const streetInput = useInput("", isNotEmpty);
    const streetNumberInput = useInput("", isNotEmpty);
    const cityInput = useInput("", isNotEmpty);
    const postalCodeInput = useInput("", isNotEmpty);

    function handleCancel(event) {
        event.preventDefault();
        setIsSubmitting(false);
        navigate("/");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);

        if (emailInput.hasError) {
            toast.error("Please enter a valid email address.");
            setIsSubmitting(false);
            return;
        }
        if (passwordInput.hasError) {
            toast.error("Password must be at least 6 characters long.");
            setIsSubmitting(false);
            return;
        }
        if (confirmPasswordInput.value !== passwordInput.value) {
            toast.error("Passwords do not match.");
            setIsSubmitting(false);
            return;
        }
        if (
            firstNameInput.hasError ||
            lastNameInput.hasError ||
            streetInput.hasError ||
            streetNumberInput.hasError ||
            cityInput.hasError ||
            postalCodeInput.hasError
        ) {
            toast.error("Please fill in all required fields.");
            setIsSubmitting(false);
            return;
        }

        const signupData = {
            email: emailInput.value,
            password: passwordInput.value,
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            street: streetInput.value,
            streetNumber: streetNumberInput.value,
            city: cityInput.value,
            postalCode: postalCodeInput.value,
        };

        try {
            const response = await fetch("http://localhost:5050/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            if (!response.ok) {
                throw new Error("Signup failed");
            }
            const data = await response.json();
            console.log("Signup successful:", data);
            toast.success("Signup successful! Please log in now via the menu.");

            emailInput.reset();
            passwordInput.reset();
            confirmPasswordInput.reset();
            firstNameInput.reset();
            lastNameInput.reset();
            streetInput.reset();
            streetNumberInput.reset();
            cityInput.reset();
            postalCodeInput.reset();
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error("Error during signup. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <h2 className="text-center mb-4">CREATE NEW ACCOUNT</h2>

                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={emailInput.value}
                        onChange={emailInput.handleInputChange}
                        onBlur={emailInput.handleInputBlur}
                        className={`form-control ${emailInput.hasError ? "is-invalid" : ""}`}
                        required
                    />
                    {emailInput.hasError && (
                        <div className="invalid-feedback">
                            Please enter a valid email.
                        </div>
                    )}
                </div>

                {/* Passwords */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={passwordInput.value}
                            onChange={passwordInput.handleInputChange}
                            onBlur={passwordInput.handleInputBlur}
                            className={`form-control ${passwordInput.hasError ? "is-invalid" : ""}`}
                            required
                            autoComplete="new-password"
                        />
                        {passwordInput.hasError && (
                            <div className="invalid-feedback">
                                Password must be at least 6 characters.
                            </div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            name="confirm-password"
                            value={confirmPasswordInput.value}
                            onChange={confirmPasswordInput.handleInputChange}
                            onBlur={confirmPasswordInput.handleInputBlur}
                            className={`form-control ${confirmPasswordInput.hasError ? "is-invalid" : ""}`}
                            required
                            autoComplete="new-password"
                        />
                        {confirmPasswordInput.hasError && (
                            <div className="invalid-feedback">
                                Please confirm your password.
                            </div>
                        )}
                    </div>
                </div>

                {/* Name Fields */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="first-name" className="form-label">First Name</label>
                        <input
                            id="first-name"
                            type="text"
                            name="first-name"
                            value={firstNameInput.value}
                            onChange={firstNameInput.handleInputChange}
                            onBlur={firstNameInput.handleInputBlur}
                            className={`form-control ${firstNameInput.hasError ? "is-invalid" : ""}`}
                            required
                        />
                        {firstNameInput.hasError && (
                            <div className="invalid-feedback">First name is required.</div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="last-name" className="form-label">Last Name</label>
                        <input
                            id="last-name"
                            type="text"
                            name="last-name"
                            value={lastNameInput.value}
                            onChange={lastNameInput.handleInputChange}
                            onBlur={lastNameInput.handleInputBlur}
                            className={`form-control ${lastNameInput.hasError ? "is-invalid" : ""}`}
                            required
                        />
                        {lastNameInput.hasError && (
                            <div className="invalid-feedback">Last name is required.</div>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="street" className="form-label">Street</label>
                        <input
                            id="street"
                            type="text"
                            name="street"
                            value={streetInput.value}
                            onChange={streetInput.handleInputChange}
                            onBlur={streetInput.handleInputBlur}
                            className={`form-control ${streetInput.hasError ? "is-invalid" : ""}`}
                            required
                        />
                        {streetInput.hasError && (
                            <div className="invalid-feedback">Street is required.</div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="street-number" className="form-label">Number</label>
                        <input
                            id="street-number"
                            type="text"
                            name="street-number"
                            value={streetNumberInput.value}
                            onChange={streetNumberInput.handleInputChange}
                            onBlur={streetNumberInput.handleInputBlur}
                            className={`form-control ${streetNumberInput.hasError ? "is-invalid" : ""}`}
                            required
                        />
                        {streetNumberInput.hasError && (
                            <div className="invalid-feedback">Street number is required.</div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="city" className="form-label">City</label>
                        <input
                            id="city"
                            type="text"
                            name="city"
                            value={cityInput.value}
                            onChange={cityInput.handleInputChange}
                            onBlur={cityInput.handleInputBlur}
                            className={`form-control ${cityInput.hasError ? "is-invalid" : ""}`}
                            required
                        />
                        {cityInput.hasError && (
                            <div className="invalid-feedback">City is required.</div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="postalCode" className="form-label">Postal Code</label>
                        <input
                            id="postalCode"
                            type="text"
                            name="postalCode"
                            value={postalCodeInput.value}
                            onChange={postalCodeInput.handleInputChange}
                            onBlur={postalCodeInput.handleInputBlur}
                            className={`form-control ${postalCodeInput.hasError ? "is-invalid" : ""}`}
                            required
                        />
                        {postalCodeInput.hasError && (
                            <div className="invalid-feedback">Postal code is required.</div>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="d-flex justify-content-center">
                    <Button type="button" onClick={handleCancel} className="btn btn-secondary">
                        Cancel
                    </Button>
                    <Button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Sign up"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
