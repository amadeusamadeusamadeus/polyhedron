import React from "react";
import "./Modal.css";

export default function Modal({ children, open, className = "", onClose }) {
    if (!open) return null;

    //TODO: No idea what that stopPropagation thing does

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-container ${className}`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
