// src/components/CartItem.jsx
import React from "react";

export default function CartItem({ name, quantity, onIncrease, onDecrease }) {
    return (
        <li className="cart-item">
            <p>
                {name} - {quantity}
            </p>
            <p className="cart-item-actions">
                <button onClick={onDecrease}>-</button>
                <span>{quantity}</span>
                <button onClick={onIncrease}>+</button>
            </p>
        </li>
    );
}