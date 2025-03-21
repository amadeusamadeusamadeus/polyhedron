// src/pages/CheckoutPage.jsx
import React from "react";
import Checkout from "../components/Checkout.jsx";
import "../index.css"

export default function CheckoutPage() {
    return (
        <div className="checkout-page-wrapper checkout-page-container">
            <Checkout isModal={false} />
        </div>
    );
}
