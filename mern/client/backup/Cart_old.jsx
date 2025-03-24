// src/components/Cart_old.jsx
import Modal from "../src/components/UI/Modal.jsx";
import { useContext, useEffect } from "react";
import CartContext from "../src/store/CartContext.jsx";
import Button from "../src/components/UI/Button.jsx";
import UserProgressContext from "../src/store/UserProgressContext.jsx";
import CartItem from "../src/components/CartItem.jsx";

export default function Cart_old() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    useEffect(() => {
        console.log("User progress changed to:", userProgressCtx.progress);
    }, [userProgressCtx.progress]);

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity * item.price,
        0
    );

    function handleGoToCheckout() {
        userProgressCtx.showCheckout();
    }

    function handleCloseCart() {
        userProgressCtx.hideCart();
    }

    return (
        <Modal
            className="cart"
            open={userProgressCtx.progress === "cart"}
            onClose={handleCloseCart}
        >
            <h2>Your Cart</h2>
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
            <p className="cart-total">Total : {cartTotal.toFixed(2)}</p>
            <p className="modal-actions">
                <Button onClick={handleCloseCart} textOnly>
                    Close
                </Button>
                {cartCtx.items.length > 0 && (
                    <Button onClick={handleGoToCheckout}>Go to Checkout</Button>
                )}
            </p>
        </Modal>
    );
}
