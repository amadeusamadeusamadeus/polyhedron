// src/components/Jumbotron.jsx
import React, { useEffect, useState } from "react";
import Button from "./UI/Button.jsx";
import "../Button.css";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function Jumbotron() {
    const handleStartNow = () => {
        const element = document.querySelector('.pitch-section');
        if (element) {
            window.scrollTo({
                top: element.getBoundingClientRect().top + window.scrollY,
                left: 0,
                behavior: "smooth"
            });
        }
    };

    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    useEffect(() => {
        const handleResize = () => setViewportHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const { scrollY } = useScroll();

    const rawOpacity = useTransform(
        scrollY,
        [viewportHeight * 0.5, viewportHeight * 0.6],
        [1, 0]
    );
    const opacitySpring = useSpring(rawOpacity, { stiffness: 80, damping: 30 });

    const rawX = useTransform(
        scrollY,
        [viewportHeight * 0.5, viewportHeight * 0.6],
        [0, -700]
    );
    const xSpring = useSpring(rawX, { stiffness: 80, damping: 30 });

    return (
        <motion.div
            id="view1"
            className="jumbotron-section wrapper row m-0"
            initial={{ opacity: 0, x: -700 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.5, duration: 1, ease: "easeOut" }}
            style={{ opacity: opacitySpring, x: xSpring }}
        >
            <div className="jumbo-content paper-card col-6 align-content-top text-start">
                <h2 className="title-chrome jumbo-title col-12 fs-1">ELEVATE YOUR GAME</h2>
                <span className="description embossed-text">
          <p>
            Our luxury dice combine cutting-edge materials with precision engineering for a perfectly balanced roll and a unique look.
          </p>
        </span>
                <hr className="line w-50 embossed-text" />
                <Button className="front-page-button" onClick={handleStartNow}
                        disableActive={true}
                        whileHoverScale={1.05}
                >EXPLORE</Button>
            </div>
        </motion.div>
    );
}
