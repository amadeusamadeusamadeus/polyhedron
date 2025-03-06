
import React from "react";
import CartContent from "../components/CartContent.jsx";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const navigate = useNavigate();

    const handleCheckout = () => {
        // Navigate to checkout page or trigger checkout logic.
        navigate("/checkout");
    };

    return (
        <div className="cart-page-container">
            <CartContent onCheckout={handleCheckout} showActions={true} />
        </div>
    );
}
