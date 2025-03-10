import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthContext.jsx";
import { isEmail, isNotEmpty } from "../utility/validation.js";
import { useInput } from "../hooks/useInput.js";

export default function UserSettings() {
    const { token, user, isAuthenticated, logout } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for details form messages and loading
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState(null);
    const [detailsSuccess, setDetailsSuccess] = useState("");

    // State for password update messages and loading
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState("");

    // Details form fields (excluding password and role)
    const emailInput = useInput("", isEmail);
    const firstNameInput = useInput("", isNotEmpty);
    const lastNameInput = useInput("", isNotEmpty);
    const streetInput = useInput("", isNotEmpty);
    const streetNumberInput = useInput("", isNotEmpty);
    const cityInput = useInput("", isNotEmpty);
    const postalCodeInput = useInput("", isNotEmpty);

    // Password update form fields
    const oldPasswordInput = useInput("", isNotEmpty);
    const newPasswordInput = useInput("", isNotEmpty);
    const confirmPasswordInput = useInput("", isNotEmpty);

    // Fetch profile on component mount
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            setLoading(true);
            fetch(`http://localhost:5050/users/profile/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch profile");
                    }
                    return response.json();
                })
                .then((data) => {
                    setProfile(data);
                    // Initialize details form fields with fetched data
                    emailInput.setEnteredValue(data.email);
                    firstNameInput.setEnteredValue(data.firstName);
                    lastNameInput.setEnteredValue(data.lastName);
                    streetInput.setEnteredValue(data.street);
                    streetNumberInput.setEnteredValue(data.streetNumber);
                    cityInput.setEnteredValue(data.city);
                    postalCodeInput.setEnteredValue(data.postalCode)
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isAuthenticated, user, token]);

    // Handle submission of the user details form
    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        setDetailsError(null);
        setDetailsSuccess("");

        // Validate fields using our custom hook flags
        if (emailInput.hasError) {
            setDetailsError("Please enter a valid email address.");
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
            setDetailsError("Please fill in all required fields.");
            return;
        }
        setDetailsLoading(true);
        const payload = {
            email: emailInput.value,
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            street: streetInput.value,
            streetNumber: streetNumberInput.value,
            city: cityInput.value,
            postalCode: postalCodeInput.value,
        };

        fetch(`http://localhost:5050/users/profile/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update user details");
                }
                return response.json();
            })
            .then((data) => {
                setProfile(data);
                setDetailsSuccess("User details updated successfully.");
                setDetailsLoading(false);
            })
            .catch((err) => {
                setDetailsError(err.message);
                setDetailsLoading(false);
            });
    };

    // Handle submission of the password update form
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess("");

        if (newPasswordInput.value !== confirmPasswordInput.value) {
            setPasswordError("New password and confirm password do not match.");
            return;
        }
        setPasswordLoading(true);

        // Send plain text new password (the backend will hash it)
        const payload = {
            oldPassword: oldPasswordInput.value,
            newPassword: newPasswordInput.value,
        };

        fetch(`http://localhost:5050/users/profile/${user.id}/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update password");
                }
                return response.json();
            })
            .then(() => {
                setPasswordSuccess("Password updated successfully.");
                // Reset password form fields
                oldPasswordInput.reset("");
                newPasswordInput.reset("");
                confirmPasswordInput.reset("");
                setPasswordLoading(false);
            })
            .catch((err) => {
                setPasswordError(err.message);
                setPasswordLoading(false);
            });
    };

    // Handle account deletion
    const handleDeleteAccount = () => {
        if (
            !window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            )
        )
            return;
        fetch(`http://localhost:5050/users/profile/${user.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete account");
                }
                return response.json();
            })
            .then(() => {
                alert("Your account has been deleted.");
                // Optionally, logout or redirect the user after deletion.
                if (logout) logout();
                // For example: window.location.href = "/";
            })
            .catch((err) => {
                alert(`Error deleting account: ${err.message}`);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-settings">
            {profile && (
                <>
                    <section className="user-settings">
                        <h3>User Settings</h3>
                        {detailsError && <p className="error">{detailsError}</p>}
                        {detailsSuccess && <p className="success">{detailsSuccess}</p>}
                        <form onSubmit={handleDetailsSubmit}>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={emailInput.value}
                                    onChange={emailInput.handleInputChange}
                                    onBlur={emailInput.handleInputBlur}
                                />
                                {emailInput.hasError && (
                                    <span>Please enter a valid email.</span>
                                )}
                            </div>
                            <div>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={firstNameInput.value}
                                    onChange={firstNameInput.handleInputChange}
                                    onBlur={firstNameInput.handleInputBlur}
                                />
                                {firstNameInput.hasError && (
                                    <span>First name is required.</span>
                                )}
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={lastNameInput.value}
                                    onChange={lastNameInput.handleInputChange}
                                    onBlur={lastNameInput.handleInputBlur}
                                />
                                {lastNameInput.hasError && (
                                    <span>Last name is required.</span>
                                )}
                            </div>
                            <div>
                                <label>Street:</label>
                                <input
                                    type="text"
                                    value={streetInput.value}
                                    onChange={streetInput.handleInputChange}
                                    onBlur={streetInput.handleInputBlur}
                                />
                                {streetInput.hasError && (
                                    <span>Street is required.</span>
                                )}
                            </div>
                            <div>
                                <label>Street Number:</label>
                                <input
                                    type="text"
                                    value={streetNumberInput.value}
                                    onChange={streetNumberInput.handleInputChange}
                                    onBlur={streetNumberInput.handleInputBlur}
                                />
                                {streetNumberInput.hasError && (
                                    <span>Street number is required.</span>
                                )}
                            </div>
                            <div>
                                <label>City:</label>
                                <input
                                    type="text"
                                    value={cityInput.value}
                                    onChange={cityInput.handleInputChange}
                                    onBlur={cityInput.handleInputBlur}
                                />
                                {cityInput.hasError && <span>City is required.</span>}
                            </div>
                            <div>
                                <label>Postal Code:</label>
                                <input
                                    type="text"
                                    value={postalCodeInput.value}
                                    onChange={postalCodeInput.handleInputChange}
                                    onBlur={postalCodeInput.handleInputBlur}
                                />
                                {postalCodeInput.hasError && <span>Postal code is required.</span>}
                            </div>
                            <button type="submit" disabled={detailsLoading}>
                                {detailsLoading ? "Updating..." : "Update Details"}
                            </button>
                        </form>
                    </section>

                    <section className="password-update">
                        <h3>Change Password</h3>
                        {passwordError && <p className="error">{passwordError}</p>}
                        {passwordSuccess && <p className="success">{passwordSuccess}</p>}
                        <form onSubmit={handlePasswordSubmit}>
                            <div>
                                <label>Old Password:</label>
                                <input
                                    type="password"
                                    value={oldPasswordInput.value}
                                    onChange={oldPasswordInput.handleInputChange}
                                    onBlur={oldPasswordInput.handleInputBlur}
                                />
                                {oldPasswordInput.hasError && (
                                    <span>Old password is required.</span>
                                )}
                            </div>
                            <div>
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    value={newPasswordInput.value}
                                    onChange={newPasswordInput.handleInputChange}
                                    onBlur={newPasswordInput.handleInputBlur}
                                />
                                {newPasswordInput.hasError && (
                                    <span>New password is required.</span>
                                )}
                            </div>
                            <div>
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    value={confirmPasswordInput.value}
                                    onChange={confirmPasswordInput.handleInputChange}
                                    onBlur={confirmPasswordInput.handleInputBlur}
                                />
                                {confirmPasswordInput.hasError && (
                                    <span>Please confirm your new password.</span>
                                )}
                            </div>
                            <button type="submit" disabled={passwordLoading}>
                                {passwordLoading ? "Updating..." : "Change Password"}
                            </button>
                        </form>
                    </section>

                    <section className="account-deletion">
                        <h3>Delete Account</h3>
                        <button onClick={handleDeleteAccount} className="delete-account">
                            Delete Account
                        </button>
                    </section>
                </>
            )}
        </div>
    );
}
