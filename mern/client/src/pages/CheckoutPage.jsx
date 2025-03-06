// src/pages/CheckoutPage.jsx
import React from "react";
import Checkout from "../components/Checkout.jsx";

export default function CheckoutPage() {
    return (
        <div className="checkout-page-wrapper">
            <Checkout isModal={false} />
        </div>
    );
}
