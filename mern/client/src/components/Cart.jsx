// src/components/Cart.jsx
import Modal from "./UI/Modal.jsx";
import { useContext, useEffect } from "react";
import CartContext from "../store/CartContext.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import CartItem from "./CartItem.jsx";

export default function Cart() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    useEffect(() => {
        console.log("User progress changed to:", userProgressCtx.progress);
    }, [userProgressCtx.progress]);

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity,
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
                        key={item.uuid} // use uuid here for uniqueness
                        name={item.name}
                        quantity={item.quantity}
                        onIncrease={() => cartCtx.addItem(item)}
                        onDecrease={() => cartCtx.removeItem(item.uuid)}
                    />
                ))}
            </ul>
            <p className="cart-total">{cartTotal}</p>
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
