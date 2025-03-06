// src/components/LoginForm.jsx
import React, { useState, useContext } from "react";
import Input from "./Input";
import { isEmail, isNotEmpty, hasMinLength } from "../utility/validation.js";
import { useInput } from "../hooks/useInput.js";
import { AuthContext } from "../store/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onLoginSuccess }) {
    const [errorMessage, setErrorMessage] = useState("");
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const {
        value: emailValue,
        handleInputChange: handleEmailChange,
        handleInputBlur: handleEmailBlur,
        hasError: emailHasError,
        reset: resetEmail
    } = useInput("", (value) => isEmail(value) && isNotEmpty(value));

    const {
        value: passwordValue,
        handleInputChange: handlePasswordChange,
        handleInputBlur: handlePasswordBlur,
        hasError: passwordHasError,
        reset: resetPassword
    } = useInput("", (value) => hasMinLength(value, 6));

    async function handleSubmit(event) {
        event.preventDefault();

        if (emailHasError || passwordHasError) {
            setErrorMessage("Please fix the errors in the form.");
            return;
        }

        const loginData = {
            email: emailValue,
            password: passwordValue,
        };

        try {
            const response = await fetch("http://localhost:5050/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            if (response.status === 401 || response.status === 422) {
                setErrorMessage("Invalid email or password.");
                return;
            }

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            console.log("Login successful:", data);
            authCtx.login(data.token, {
                id: data.userId,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
            });

            resetEmail();
            resetPassword();
            setErrorMessage("");

            if (onLoginSuccess) onLoginSuccess();
            navigate("/"); // Redirect to home after login.
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("Error during login. Please try again.");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <div className="control-row">
                <Input
                    label="Email"
                    id="email"
                    type="email"
                    name="email"
                    onBlur={handleEmailBlur}
                    onChange={handleEmailChange}
                    value={emailValue}
                    error={emailHasError && "Please enter a valid email address."}
                    required
                />
                <Input
                    label="Password"
                    id="password"
                    type="password"
                    name="password"
                    onBlur={handlePasswordBlur}
                    onChange={handlePasswordChange}
                    value={passwordValue}
                    error={passwordHasError && "Password must be at least 6 characters long."}
                    minLength={6}
                    required
                />
            </div>
            <p className="form-actions">
                <button className="button button-flat" type="reset">Reset</button>
                <button className="button" type="submit">Login</button>
            </p>
        </form>
    );
}
