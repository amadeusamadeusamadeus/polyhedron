// src/components/CartModal.jsx
import React, { useContext, useState } from "react";
import Modal from "./UI/Modal.jsx";
import CartContent from "./CartContent.jsx";
import LoginModal from "./LoginModal.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import { AuthContext } from "../store/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Button from "./UI/Button.jsx";

export default function CartModal() {
    const userProgressCtx = useContext(UserProgressContext);
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);

    function handleCloseCart() {
        userProgressCtx.hideCart();
    }

    function handleCheckout() {
        console.log("Auth status in handleCheckout:", authCtx.isAuthenticated);
        if (!authCtx.isAuthenticated) {
            setShowLoginModal(true);
            userProgressCtx.hideCheckout();
        } else {
            userProgressCtx.showCheckout();
            // navigate("/checkout");
        }
    }

    function handleLoginSuccess() {
        setShowLoginModal(false);
        userProgressCtx.showCheckout();
        // navigate("/checkout");
    }

    return (
        <>
            <Modal
                className="cart"
                open={userProgressCtx.progress === "cart"}
                onClose={handleCloseCart}
            >
                <CartContent onClose={handleCloseCart} onCheckout={handleCheckout} showActions={false} />
                <div className="modal-actions">
                    <Button onClick={handleCloseCart}>Close</Button>
                    <Button onClick={handleCheckout}>Go to Checkout</Button>
                </div>
            </Modal>
            <LoginModal
                open={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
}
