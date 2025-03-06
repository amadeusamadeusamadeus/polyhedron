// src/components/LoginModal.jsx
import React from "react";
import Modal from "./UI/Modal.jsx";
import LoginForm from "./LoginForm.jsx";

export default function LoginModal({ open, onClose, onLoginSuccess }) {
    return (
        <Modal open={open} onClose={onClose} className="login-modal">
            <LoginForm onLoginSuccess={onLoginSuccess} />
        </Modal>
    );
}
