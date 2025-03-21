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
            <div className="item-details">
                <span className="item-name">Shape: {shapeName}</span>
                <span className="item-material">Material: {name}</span>
                <span className="item-quantity">Quantity: {quantity}</span>
                <span className="item-price">Unit price: € {price.toFixed(2)}</span>
            </div>
            <div className="cart-item-actions">
                <button onClick={onDecrease}>-</button>
                <span>{quantity}</span>
                <button onClick={onIncrease}>+</button>
            </div>
        </li>
    );
}
