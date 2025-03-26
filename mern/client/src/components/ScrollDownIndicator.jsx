// src/components/ScrollDownIndicator.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScrollDownIndicator() {
    const [hideIndicator, setHideIndicator] = useState(false);

    useEffect(() => {
        const view3Element = document.getElementById("view3");
        if (!view3Element) return;

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio >= 0.5) {
                        setHideIndicator(true);
                        obs.disconnect();
                    }
                });
            },
            { root: null, threshold: 0.5 }
        );
        observer.observe(view3Element);
        return () => observer.disconnect();
    }, []);

    if (hideIndicator) {
        return null;
    }


    const variants = {
        visible: { opacity: 1, y: 0, transition: { delay: 3.8, duration: 0.2, ease: "easeOut" } },
        hidden: { opacity: 0, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
    };

    return (
        <motion.div
            initial="hidden"
            animate={hideIndicator ? "hidden" : "visible"}
            variants={variants}
            style={{
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 11000,
                textAlign: "center",
            }}
        >
            <p style={{ margin: 0 }}>Scroll Down</p>
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ marginTop: "5px" }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 16l-6-6h12z" />
                </svg>
            </motion.div>
        </motion.div>
    );
}
