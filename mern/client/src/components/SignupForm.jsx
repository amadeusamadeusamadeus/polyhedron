// src/components/SignupForm.jsx
import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import Input from "./Input";
import { isEmail, isNotEmpty, hasMinLength } from "../utility/validation.js";

export default function SignupForm() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordsAreNotEqual, setPasswordsAreNotEqual] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");

    const [enteredValues, setEnteredValues] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        street: "",
        streetNumber: "",
        city: ""
    });

    function handleInputChange(identifier, value) {
        setEnteredValues((prevValues) => ({
            ...prevValues,
            [identifier]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setFeedbackMessage("");
        setPasswordsAreNotEqual(false);

        if (enteredValues.password !== enteredValues.confirmPassword) {
            setPasswordsAreNotEqual(true);
            setIsSubmitting(false);
            return;
        }

        const signupData = {
            email: enteredValues.email,
            password: enteredValues.password,
            firstName: enteredValues.firstName,
            lastName: enteredValues.lastName,
            street: enteredValues.street,
            streetNumber: enteredValues.streetNumber,
            city: enteredValues.city
        };

        try {
            const response = await fetch("http://localhost:5050/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(signupData)
            });

            if (!response.ok) {
                throw new Error("Signup failed");
            }
            const data = await response.json();
            console.log("Signup successful:", data);
            setFeedbackMessage("Signup successful! Please log in now via the menu.");
            // Optionally, clear form fields:
            setEnteredValues({
                email: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName: "",
                street: "",
                streetNumber: "",
                city: ""
            });
            // Optionally, navigate to the login page if desired:
            // navigate("/users/login");
        } catch (error) {
            console.error("Error during signup:", error);
            setFeedbackMessage("Error during signup. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Create New Account</h2>
            {feedbackMessage && <p className="feedback">{feedbackMessage}</p>}

            <div className="control">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    onChange={(event) =>
                        handleInputChange("email", event.target.value)
                    }
                    value={enteredValues.email}
                    required
                />
            </div>

            <div className="control-row">
                <div className="control">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        onChange={(event) =>
                            handleInputChange("password", event.target.value)
                        }
                        value={enteredValues.password}
                        required
                        minLength={6}
                        autoComplete="current-password"
                    />
                </div>

                <div className="control">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        id="confirm-password"
                        type="password"
                        name="confirm-password"
                        onChange={(event) =>
                            handleInputChange("confirmPassword", event.target.value)
                        }
                        value={enteredValues.confirmPassword}
                        autoComplete="current-password"
                        required
                    />
                    <div className="control-error">
                        {passwordsAreNotEqual && <p>Passwords must match.</p>}
                    </div>
                </div>
            </div>

            <div className="control-row">
                <div className="control">
                    <label htmlFor="first-name">First Name</label>
                    <input
                        type="text"
                        id="first-name"
                        name="first-name"
                        onChange={(event) =>
                            handleInputChange("firstName", event.target.value)
                        }
                        value={enteredValues.firstName}
                        required
                    />
                </div>

                <div className="control">
                    <label htmlFor="last-name">Last Name</label>
                    <input
                        type="text"
                        id="last-name"
                        name="last-name"
                        onChange={(event) =>
                            handleInputChange("lastName", event.target.value)
                        }
                        value={enteredValues.lastName}
                        required
                    />
                </div>
            </div>

            <div className="control-row">
                <div className="control">
                    <label htmlFor="street">Street</label>
                    <input
                        type="text"
                        id="street"
                        name="street"
                        onChange={(event) =>
                            handleInputChange("street", event.target.value)
                        }
                        value={enteredValues.street}
                        required
                    />
                </div>

                <div className="control">
                    <label htmlFor="street-number">Number</label>
                    <input
                        type="text"
                        id="street-number"
                        name="street-number"
                        onChange={(event) =>
                            handleInputChange("streetNumber", event.target.value)
                        }
                        value={enteredValues.streetNumber}
                        required
                    />
                </div>

                <div className="control">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        onChange={(event) =>
                            handleInputChange("city", event.target.value)
                        }
                        value={enteredValues.city}
                        required
                    />
                </div>
            </div>

            <div className="control">
                <label htmlFor="terms-and-conditions">
                    <input
                        type="checkbox"
                        id="terms-and-conditions"
                        name="terms"
                        required
                    />
                    I agree to the terms and conditions
                </label>
            </div>

            <p className="form-actions">
                <button type="button" className="button button-flat">
                    Cancel
                </button>
                <button type="reset" className="button button-flat">
                    Reset
                </button>
                <button className="button" type="submit">
                    {isSubmitting ? "Submitting..." : "Sign up"}
                </button>
            </p>
        </Form>
    );
}
