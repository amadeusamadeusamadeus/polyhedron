// src/components/LoginForm.jsx
import React, {useState, useContext} from "react";
import Input from "./Input";
import {isEmail, isNotEmpty, hasMinLength} from "../utility/validation.js";
import {useInput} from "../hooks/useInput.js";
import {AuthContext} from "../contexts/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import Button from "./UI/Button.jsx";


export default function LoginForm({onLoginSuccess}) {
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
                headers: {"Content-Type": "application/json"},
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
            if (data.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("Error during login. Please try again.");
        }
    }

    return (
            <div className="login-form">
                <h2>LOGIN</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-fields">
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
                        {emailValue.hasError && (
                            <div className="invalid-feedback">
                                Please enter a valid email.
                            </div>
                        )}


                        <Input
                            label="Password"
                            id="password"
                            type="password"
                            name="password"
                            onBlur={handlePasswordBlur}
                            onChange={handlePasswordChange}
                            value={passwordValue}
                            error={passwordHasError && "Password must be at least 6 characters long"}
                            minLength={6}
                            required
                        />
                        {passwordValue.hasError && (
                            <div className="invalid-feedback">
                                Password is incorrect.
                            </div>
                        )}
                    </div>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <div className="form-actions">
                        <Button disableActive={false} whileHoverScale={0} className="button fs-6 text-center justify-content-center" type="submit">Login</Button>
                        {/*<Button disableActive={false} className="button fs-6" type="reset">Reset</Button>*/}
                    </div>
                </form>
            </div>
    );
}
