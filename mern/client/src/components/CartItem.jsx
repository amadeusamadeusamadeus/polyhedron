// src/components/CartItem.jsx
import React from "react";

export default function CartItem({
                                     shapeName,
                                     name,
                                     quantity,
                                     price,
                                     onIncrease,
                                     onDecrease,
                                 }) {
    return (
        <li className="cart-item">
            <p>
                {shapeName} Material: {name} – Quantity: {quantity} – Price:
                {price.toFixed(2)}
            </p>
            <p className="cart-item-actions">
                <button onClick={onDecrease}>-</button>
                <span>{quantity}</span>
                <button onClick={onIncrease}>+</button>
            </p>
        </li>
    );
}
