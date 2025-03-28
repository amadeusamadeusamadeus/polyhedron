// src/components/CartContent.jsx
import React, {useContext, useEffect} from "react";
import CartContext from "../contexts/CartContext.jsx";
import CartItem from "./CartItem.jsx";
import Button from "./UI/Button.jsx";

export default function CartContent({onClose, onCheckout, showActions = true}) {
    const cartCtx = useContext(CartContext);

    useEffect(() => {
        console.log("CartPage items:", cartCtx.items);
    }, [cartCtx.items]);

    const cartTotal = cartCtx.items.reduce(
        (total, item) => total + (item.quantity * (item.price || 0)),
        0
    );

    return (
        <div className="cart-content">
            <h2>YOUR CART</h2>

            {cartCtx.items.length === 0 ? (
                <p className="text-center">Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-items">
                        <ul>
                            {cartCtx.items.map((item) => (
                                <CartItem
                                    key={item.uuid}
                                    shapeName={item.shapeName}
                                    name={item.name}
                                    quantity={item.quantity}
                                    price={item.price}
                                    onIncrease={() => cartCtx.addItem(item)}
                                    onDecrease={() => cartCtx.removeItem(item.uuid)}
                                />
                            ))}
                        </ul>
                    </div>
                    <p className="cart-total">Total: € {cartTotal.toFixed(2)}</p>
                </>
            )}
            {showActions && (
                <div className="cart-actions d-flex justify-content-center align-items-center ">
                    {onClose && <Button onClick={onClose} textOnly>Close</Button>}
                    {cartCtx.items.length > 0 && onCheckout && (
                        <Button className="text-center" onClick={onCheckout}>Go to Checkout</Button>
                    )}
                </div>
            )}
        </div>
    );
}
