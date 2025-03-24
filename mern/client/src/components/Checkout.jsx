// src/components/Checkout.jsx
import React, { useContext, useEffect, useState } from "react";
import Modal from "./UI/Modal.jsx";
import cartContext from "../store/CartContext.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import Input from "./Input.jsx";
import { useInput } from "../hooks/useInput.js";
import { isEmail, isNotEmpty } from "../utility/validation.js";
import { getAuthToken } from "../utility/auth.js";
import { AuthContext } from "../store/AuthContext.jsx";
import mastercard from "../assets/icons/payment/mastercard.svg"
import amex from "../assets/icons/payment/amex.svg"
import paypal from "../assets/icons/payment/paypal.svg"
import visa from "../assets/icons/payment/visa.svg"
import applepay from "../assets/icons/payment/apple-pay.svg"
import card from "../assets/icons/payment/generic.svg"
import code from "../assets/icons/payment/code.svg"

export default function Checkout({ isModal = true, onClose = () => {} }) {
    const cartCtx = useContext(cartContext);
    const userProgressCtx = useContext(UserProgressContext);
    const authCtx = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const cartTotal = cartCtx.items.reduce(
        (total, item) => total + (item.quantity * (item.price || 0)),
        0
    );

    useEffect(() => {
        if (authCtx.isAuthenticated && authCtx.user?.id) {
            setLoadingProfile(true);
            fetch(`http://localhost:5050/users/profile/${authCtx.user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authCtx.token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch profile data");
                    }
                    return response.json();
                })
                .then((data) => {
                    setProfileData(data);
                    setLoadingProfile(false);
                })
                .catch((error) => {
                    console.error("Error fetching profile data:", error);
                    setLoadingProfile(false);
                });
        }
    }, [authCtx.isAuthenticated, authCtx.user, authCtx.token]);


    const defaultEmail = profileData?.email || "";
    const defaultFirstName = profileData?.firstName || "";
    const defaultLastName = profileData?.lastName || "";
    const defaultStreet = profileData?.street || "";
    const defaultStreetNumber = profileData?.streetNumber || "";
    const defaultPostalCode = profileData?.postalCode || "";
    const defaultCity = profileData?.city || "";


    // Customer fields
    const {
        value: emailValue,
        handleInputChange: handleEmailChange,
        handleInputBlur: handleEmailBlur,
        hasError: emailHasError,
        reset: resetEmailField,
    } = useInput(defaultEmail, (value) => isEmail(value) && isNotEmpty(value));

    const {
        value: firstNameValue,
        handleInputChange: handleFirstNameChange,
        handleInputBlur: handleFirstNameBlur,
        hasError: firstNameHasError,
        reset: resetFirstNameField,
    } = useInput(defaultFirstName, isNotEmpty);

    const {
        value: lastNameValue,
        handleInputChange: handleLastNameChange,
        handleInputBlur: handleLastNameBlur,
        hasError: lastNameHasError,
        reset: resetLastNameField,
    } = useInput(defaultLastName, isNotEmpty);

    const {
        value: streetValue,
        handleInputChange: handleStreetChange,
        handleInputBlur: handleStreetBlur,
        hasError: streetHasError,
        reset: resetStreetField,
    } = useInput(defaultStreet, isNotEmpty);

    const {
        value: streetNumberValue,
        handleInputChange: handleStreetNumberChange,
        handleInputBlur: handleStreetNumberBlur,
        hasError: streetNumberHasError,
        reset: resetStreetNumberField,
    } = useInput(defaultStreetNumber, isNotEmpty);

    const {
        value: postalCodeValue,
        handleInputChange: handlePostalCodeChange,
        handleInputBlur: handlePostalCodeBlur,
        hasError: postalCodeHasError,
        reset: resetPostalCodeField,
    } = useInput(defaultPostalCode, isNotEmpty);

    const {
        value: cityValue,
        handleInputChange: handleCityChange,
        handleInputBlur: handleCityBlur,
        hasError: cityHasError,
        reset: resetCityField,
    } = useInput(defaultCity, isNotEmpty);

    // Payment fields (start empty)
    const {
        value: cardNumber,
        handleInputChange: handleCardNumberChange,
        handleInputBlur: handleCardNumberBlur,
        hasError: cardNumberHasError,
        reset: resetCardNumber,
    } = useInput("", (value) => value.trim() !== "");

    const {
        value: expiryDate,
        handleInputChange: handleExpiryDateChange,
        handleInputBlur: handleExpiryDateBlur,
        hasError: expiryDateHasError,
        reset: resetExpiryDate,
    } = useInput("", (value) => value.trim() !== "");

    const {
        value: securityCode,
        handleInputChange: handleSecurityCodeChange,
        handleInputBlur: handleSecurityCodeBlur,
        hasError: securityCodeHasError,
        reset: resetSecurityCode,
    } = useInput("", (value) => value.trim() !== "");

    const [isModalOpen, setIsModalOpen] = useState(true);

    function handleClose() {
        setIsModalOpen(false);
        setTimeout(() => {
            userProgressCtx.hideCheckout(); // This will close the modal after animation
        }, 300); // Set a timeout that matches the animation duration (300ms)
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (
            emailHasError ||
            firstNameHasError ||
            lastNameHasError ||
            streetHasError ||
            streetNumberHasError ||
            postalCodeHasError ||
            cityHasError ||
            cardNumberHasError ||
            expiryDateHasError ||
            securityCodeHasError
        ) {
            console.error("Validation error in one or more fields.");
            return;
        }

        // Structure customer data including address and payment details.
        const customerData = {
            email: emailValue,
            firstName: firstNameValue,
            lastName: lastNameValue,
            address: {
                street: streetValue,
                streetNumber: streetNumberValue,
                postalCode: postalCodeValue,
                city: cityValue,
            },
            payment: {
                cardNumber,
                expiryDate,
                securityCode,
            },
        };

        // Structure items data.
        const itemsData = cartCtx.items.map((item) => ({
            shape: item.shapeName,
            material: item.name,
            unitPrice: item.price,
            quantity: item.quantity,
        }));

        const token = getAuthToken();

        fetch("http://localhost:5050/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                order: {
                    customer: customerData,
                    items: itemsData,
                    status: "Ordered",
                    totalPrice: parseFloat((cartTotal).toFixed(2)),
                    createdAt: new Date().toISOString(),
                },
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Order created:", data);
                resetEmailField();
                resetFirstNameField();
                resetLastNameField();
                resetStreetField();
                resetStreetNumberField();
                resetPostalCodeField();
                resetCityField();
                resetCardNumber();
                resetExpiryDate();
                resetSecurityCode();
                cartCtx.clearCart();
                if (isModal) userProgressCtx.hideCheckout();
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    }

    // If profile is loading, show a loading indicator.
    if (authCtx.isAuthenticated && loadingProfile) {
        return <p>Loading profile...</p>;
    }

    const content = (
        <form onSubmit={handleSubmit}>
            <h2>CHECKOUT</h2>
            <fieldset>
                <legend>Customer Information</legend>
                <div className="control">
                    <label htmlFor="email">Email</label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        onBlur={handleEmailBlur}
                        onChange={handleEmailChange}
                        value={emailValue}
                        error={emailHasError && "Please enter a valid email address."}
                        required
                    />
                </div>
                <div className="control-row">
                    <div className="control">
                        <label htmlFor="first-name">First Name</label>
                        <Input
                            type="text"
                            id="first-name"
                            name="first-name"
                            onBlur={handleFirstNameBlur}
                            onChange={handleFirstNameChange}
                            value={firstNameValue}
                            error={firstNameHasError && "Please enter your first name."}
                            required
                        />
                    </div>
                    <div className="control">
                        <label htmlFor="last-name">Last Name</label>
                        <Input
                            type="text"
                            id="last-name"
                            name="last-name"
                            onBlur={handleLastNameBlur}
                            onChange={handleLastNameChange}
                            value={lastNameValue}
                            error={lastNameHasError && "Please enter your last name."}
                            required
                        />
                    </div>
                </div>
                <div className="control-row">
                    <div className="control">
                        <label htmlFor="street">Street</label>
                        <Input
                            type="text"
                            id="street"
                            name="street"
                            onBlur={handleStreetBlur}
                            onChange={handleStreetChange}
                            value={streetValue}
                            error={streetHasError && "Please enter your street."}
                            required
                        />
                    </div>
                    <div className="control">
                        <label htmlFor="street-number">Number</label>
                        <Input
                            type="text"
                            id="street-number"
                            name="street-number"
                            onBlur={handleStreetNumberBlur}
                            onChange={handleStreetNumberChange}
                            value={streetNumberValue}
                            error={streetNumberHasError && "Please enter your street number."}
                            required
                        />
                    </div>
                </div>
                <div className="control-row">
                    <div className="control">
                        <label htmlFor="postal-code">Postal Code</label>
                        <Input
                            type="text"
                            id="postal-code"
                            name="postal-code"
                            onBlur={handlePostalCodeBlur}
                            onChange={handlePostalCodeChange}
                            value={postalCodeValue}
                            error={postalCodeHasError && "Please enter your postal code."}
                            required
                        />
                    </div>
                    <div className="control">
                        <label htmlFor="city">City</label>
                        <Input
                            type="text"
                            id="city"
                            name="city"
                            onBlur={handleCityBlur}
                            onChange={handleCityChange}
                            value={cityValue}
                            error={cityHasError && "Please enter your city."}
                            required
                        />
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>Payment Details</legend>
                <ul className="payment-option m-0 p-0">
                    <li><img src={mastercard} alt="master card"/></li>
                    <li><img src={visa} alt="visa"/></li>
                    <li><img src={applepay} alt="apple pay"/></li>
                    <li><img src={amex} alt="american express"/></li>
                    <li><img src={paypal} alt="paypal"/></li>
                </ul>
                <div className="control-with-image">
                    <label htmlFor="card-number">Card Number</label>
                    <Input
                        id="card-number"
                        type="text"
                        name="card-number"
                        onBlur={handleCardNumberBlur}
                        onChange={handleCardNumberChange}
                        value={cardNumber}
                        error={cardNumberHasError && "Please enter your card number."}
                        required
                    />
                    <img src={card} alt="front of credit card" className="input-image"/>
                </div>
                <div className="control-row">
                    <div className="control">
                        <label htmlFor="expiry-date">Expiry Date</label>
                        <Input
                            className={`form-control ${expiryDate.hasError ? "is-invalid" : ""}`}
                            id="expiry-date"
                            type="text"
                            name="expiry-date"
                            onBlur={handleExpiryDateBlur}
                            onChange={handleExpiryDateChange}
                            value={expiryDate}
                            error={expiryDateHasError && "Please enter the expiry date."}
                            required
                        />
                        {expiryDate.hasError && (
                            <div className="invalid-feedback">
                                Expiry date incorrect or empty.
                            </div>
                        )}
                    </div>
                    <div className="control-with-image">
                        <label htmlFor="security-code">Security Code</label>
                        <Input
                            id="security-code"
                            type="text"
                            name="security-code"
                            onBlur={handleSecurityCodeBlur}
                            onChange={handleSecurityCodeChange}
                            value={securityCode}
                            error={securityCodeHasError && "Please enter the security code."}
                            required
                        />
                        <img src={code} alt="front of credit card" className="input-image"/>
                    </div>
                </div>
            </fieldset>
            <div className="total-amount">
                <span>Total Amount: </span>
                <span>€ {parseFloat((cartTotal).toFixed(2))}</span>
            </div>
            <p className="modal-actions">
                {isModal && (
                    <Button type="button" onClick={handleClose}>
                        Close
                    </Button>
                )}
                <Button type="submit">Submit Order</Button>
            </p>
        </form>
    );

    return isModal ? (
        <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
            <div className="checkout-page-container"> {content}</div>
        </Modal>
) : (
    <div className="checkout-page-container">{content}</div>
    );
}
