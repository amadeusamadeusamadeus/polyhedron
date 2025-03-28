// src/components/UserSettings.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { isEmail, isNotEmpty } from "../utility/validation.js";
import { useInput } from "../hooks/useInput.js";
import Input from "../components/Input";
import Button from "../components/UI/Button.jsx";
import { toast } from "react-toastify";

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

    // Details form fields
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

    // Fetch profile on mount
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
                    postalCodeInput.setEnteredValue(data.postalCode);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isAuthenticated, user, token]);

    // Handle submission of details form
    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        setDetailsError(null);
        setDetailsSuccess("");

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
                toast.success("User details updated successfully.");
                setDetailsLoading(false);
            })
            .catch((err) => {
                setDetailsError(err.message);
                setDetailsLoading(false);
            });
    };

    // Handle submission of password update form
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess("");

        if (newPasswordInput.value !== confirmPasswordInput.value) {
            setPasswordError("New password and confirm password do not match.");
            return;
        }
        setPasswordLoading(true);
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
                // setPasswordSuccess("Password updated successfully.");
                toast.success("Password updated successfully.")
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
                // alert("Your account has been deleted.");
                toast.error("Account deleted successfully.");
                if (logout) logout();
            })
            .catch((err) => {
                // alert(`Error deleting account: ${err.message}`);
                toast.error(`Error deleting account: ${err.message}`)
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-settings-container my-4">
            {profile && (
                <>
                    {/* Details Update Form */}
                    <section className="user-settings-details mb-5">
                        <h2 className="text-center">USER SETTINGS</h2>
                        {detailsError && (
                            <div className="alert alert-danger" role="alert">
                                {detailsError}
                            </div>
                        )}
                        {detailsSuccess && (
                            <div className="alert alert-success" role="alert">
                                {detailsSuccess}
                            </div>
                        )}
                        <form onSubmit={handleDetailsSubmit} className="row g-3">
                            <div className="control-row">
                                <label htmlFor="email" className="form-label user-settings-label">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`form-control ${emailInput.hasError ? "is-invalid" : ""}`}
                                    value={emailInput.value}
                                    onChange={emailInput.handleInputChange}
                                    onBlur={emailInput.handleInputBlur}
                                    required
                                />
                                {emailInput.hasError && (
                                    <div className="invalid-feedback">
                                        Please enter a valid email.
                                    </div>
                                )}
                            </div>

                            <div className="control-row col-md-6">
                                <label htmlFor="first-name" className="form-label user-settings-label">
                                    First Name
                                </label>
                                <Input
                                    type="text"
                                    id="first-name"
                                    name="first-name"
                                    className={`form-control ${firstNameInput.hasError ? "is-invalid" : ""}`}
                                    value={firstNameInput.value}
                                    onChange={firstNameInput.handleInputChange}
                                    onBlur={firstNameInput.handleInputBlur}
                                    required
                                />
                                {firstNameInput.hasError && (
                                    <div className="invalid-feedback">
                                        First name is required.
                                    </div>
                                )}
                            </div>

                            <div className="control-row col-md-6">
                                <label htmlFor="last-name" className="form-label user-settings-label">
                                    Last Name
                                </label>
                                <Input
                                    type="text"
                                    id="last-name"
                                    name="last-name"
                                    className={`form-control ${lastNameInput.hasError ? "is-invalid" : ""}`}
                                    value={lastNameInput.value}
                                    onChange={lastNameInput.handleInputChange}
                                    onBlur={lastNameInput.handleInputBlur}
                                    required
                                />
                                {lastNameInput.hasError && (
                                    <div className="invalid-feedback">
                                        Last name is required.
                                    </div>
                                )}
                            </div>

                            <div className="control-row col-md-5">
                                <label htmlFor="street" className="form-label user-settings-label">
                                    Street
                                </label>
                                <Input
                                    type="text"
                                    id="street"
                                    name="street"
                                    className={`form-control ${streetInput.hasError ? "is-invalid" : ""}`}
                                    value={streetInput.value}
                                    onChange={streetInput.handleInputChange}
                                    onBlur={streetInput.handleInputBlur}
                                    required
                                />
                                {streetInput.hasError && (
                                    <div className="invalid-feedback">
                                        Street is required.
                                    </div>
                                )}
                            </div>

                            <div className="control-row col-md-2">
                                <label htmlFor="street-number" className="form-label user-settings-label">
                                    #
                                </label>
                                <Input
                                    type="text"
                                    id="street-number"
                                    name="street-number"
                                    className={`form-control ${streetNumberInput.hasError ? "is-invalid" : ""}`}
                                    value={streetNumberInput.value}
                                    onChange={streetNumberInput.handleInputChange}
                                    onBlur={streetNumberInput.handleInputBlur}
                                    required
                                />
                                {streetNumberInput.hasError && (
                                    <div className="invalid-feedback">
                                        Street number is required.
                                    </div>
                                )}
                            </div>

                            <div className="control-row col-md-3">
                                <label htmlFor="city" className="form-label user-settings-label">
                                    City
                                </label>
                                <Input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className={`form-control ${cityInput.hasError ? "is-invalid" : ""}`}
                                    value={cityInput.value}
                                    onChange={cityInput.handleInputChange}
                                    onBlur={cityInput.handleInputBlur}
                                    required
                                />
                                {cityInput.hasError && (
                                    <div className="invalid-feedback">
                                        City is required.
                                    </div>
                                )}
                            </div>

                            <div className="control-row col-md-2">
                                <label htmlFor="postalCode" className="form-label user-settings-label">
                                    Zip Code
                                </label>
                                <Input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    className={`form-control ${postalCodeInput.hasError ? "is-invalid" : ""}`}
                                    value={postalCodeInput.value}
                                    onChange={postalCodeInput.handleInputChange}
                                    onBlur={postalCodeInput.handleInputBlur}
                                    required
                                />
                                {postalCodeInput.hasError && (
                                    <div className="invalid-feedback">
                                        Postal code is required.
                                    </div>
                                )}
                            </div>

                            <div className="">
                                <Button type="submit" className="" disabled={detailsLoading}>
                                    {detailsLoading ? "Updating..." : "Update Details"}
                                </Button>
                            </div>
                        </form>
                    </section>

                    {/* Password Update Form */}
                    <section className="password-update mb-5">
                        <h3>Change Password</h3>
                        {passwordError && (
                            <div className="alert alert-danger" role="alert">
                                {passwordError}
                            </div>
                        )}
                        {passwordSuccess && (
                            <div className="alert alert-success" role="alert">
                                {passwordSuccess}
                            </div>
                        )}
                        <form onSubmit={handlePasswordSubmit} className="row g-3">
                            <div className="control-row col-md-4">
                                <label htmlFor="old-password" className="form-label user-settings-label">
                                    Old Password
                                </label>
                                <input
                                    type="password"
                                    id="old-password"
                                    name="old-password"
                                    className={`form-control ${oldPasswordInput.hasError ? "is-invalid" : ""}`}
                                    value={oldPasswordInput.value}
                                    onChange={oldPasswordInput.handleInputChange}
                                    onBlur={oldPasswordInput.handleInputBlur}
                                    required
                                />
                                {oldPasswordInput.hasError && (
                                    <div className="invalid-feedback">
                                        Old password is required.
                                    </div>
                                )}
                            </div>

                            <div className="control-row col-md-4">
                            <label htmlFor="new-password" className="form-label user-settings-label">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="new-password"
                                    name="new-password"
                                    className={`form-control ${newPasswordInput.hasError ? "is-invalid" : ""}`}
                                    value={newPasswordInput.value}
                                    onChange={newPasswordInput.handleInputChange}
                                    onBlur={newPasswordInput.handleInputBlur}
                                    required
                                />
                                {newPasswordInput.hasError && (
                                    <div className="invalid-feedback">
                                        New password is required.
                                    </div>
                                )}
                            </div>

                            <div className="control-row col-md-4">
                                <label htmlFor="confirm-password" className="form-label user-settings-label">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    name="confirm-password"
                                    className={`form-control ${confirmPasswordInput.hasError ? "is-invalid" : ""}`}
                                    value={confirmPasswordInput.value}
                                    onChange={confirmPasswordInput.handleInputChange}
                                    onBlur={confirmPasswordInput.handleInputBlur}
                                    required
                                />
                                {confirmPasswordInput.hasError && (
                                    <div className="invalid-feedback">
                                        Confirm your new password.
                                    </div>
                                )}
                            </div>

                            <div className="col-12">
                                <Button type="submit" className="" disabled={passwordLoading}>
                                    {passwordLoading ? "Updating..." : "Change Password"}
                                </Button>
                            </div>
                        </form>
                    </section>

                    {/* Account Deletion */}
                    <section className="account-deletion mb-5">
                        <h3>Delete Account</h3>
                        <Button onClick={handleDeleteAccount} className="btn-danger">
                            Delete Account
                        </Button>
                    </section>
                </>
            )}
        </div>
    );
}
