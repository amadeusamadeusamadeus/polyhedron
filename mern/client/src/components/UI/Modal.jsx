import React from "react";
import { motion } from "framer-motion";
import "./Modal.css";

export default function Modal({ children, open, className = "", onClose }) {
    if (!open) return null;

    const modalVariants = {
        hidden: { opacity: 0, y: "100%" },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "100%" },
    };

    return (
        <motion.div
            className="modal-overlay"
            onClick={onClose}
            initial="hidden"
            animate={open ? "visible" : "hidden"}
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <motion.div
                className={`modal-container ${className}`}
                onClick={(e) => e.stopPropagation()}
                variants={modalVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
