// src/components/Checkout.jsx
import React, { useContext } from "react";
import Modal from "./UI/Modal.jsx";
import cartContext from "../store/CartContext.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import Input from "./Input.jsx";
import { useInput } from "../hooks/useInput.js";
import { isEmail, isNotEmpty } from "../utility/validation.js";

export default function Checkout() {
    const cartCtx = useContext(cartContext);
    const userProgressCtx = useContext(UserProgressContext);
    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity,
        0
    );

    // Set up useInput for each field
    const {
        value: emailValue,
        handleInputChange: handleEmailChange,
        handleInputBlur: handleEmailBlur,
        hasError: emailHasError,
        reset: resetEmail,
    } = useInput("", (value) => isEmail(value) && isNotEmpty(value));

    const {
        value: firstNameValue,
        handleInputChange: handleFirstNameChange,
        handleInputBlur: handleFirstNameBlur,
        hasError: firstNameHasError,
        reset: resetFirstName,
    } = useInput("", isNotEmpty);

    const {
        value: lastNameValue,
        handleInputChange: handleLastNameChange,
        handleInputBlur: handleLastNameBlur,
        hasError: lastNameHasError,
        reset: resetLastName,
    } = useInput("", isNotEmpty);

    const {
        value: streetValue,
        handleInputChange: handleStreetChange,
        handleInputBlur: handleStreetBlur,
        hasError: streetHasError,
        reset: resetStreet,
    } = useInput("", isNotEmpty);

    const {
        value: streetNumberValue,
        handleInputChange: handleStreetNumberChange,
        handleInputBlur: handleStreetNumberBlur,
        hasError: streetNumberHasError,
        reset: resetStreetNumber,
    } = useInput("", isNotEmpty);

    const {
        value: postalCodeValue,
        handleInputChange: handlePostalCodeChange,
        handleInputBlur: handlePostalCodeBlur,
        hasError: postalCodeHasError,
        reset: resetPostalCode,
    } = useInput("", isNotEmpty);

    const {
        value: cityValue,
        handleInputChange: handleCityChange,
        handleInputBlur: handleCityBlur,
        hasError: cityHasError,
        reset: resetCity,
    } = useInput("", isNotEmpty);

    function handleClose() {
        userProgressCtx.hideCheckout();
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
            cityHasError
        ) {
            console.error("Validation error in one or more fields.");
            return;
        }

        // Build the customer data object
        const customerData = {
            email: emailValue,
            firstName: firstNameValue,
            lastName: lastNameValue,
            street: streetValue,
            streetNumber: streetNumberValue,
            postalCode: postalCodeValue,
            city: cityValue,
        };

        fetch("http://localhost:5050/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData,
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
                resetEmail();
                resetFirstName();
                resetLastName();
                resetStreet();
                resetStreetNumber();
                resetPostalCode();
                resetCity();
                userProgressCtx.hideCheckout();
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    }

    return (
        <Modal open={userProgressCtx.progress === "checkout"}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {cartTotal}</p>
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
                <p className="modal-actions">
                    <Button textOnly type="button" onClick={handleClose}>
                        Close
                    </Button>
                    <Button>Submit Order</Button>
                </p>
            </form>
        </Modal>
    );
}
