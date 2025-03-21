// src/components/PreviewSection.jsx
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import "../Button.css"
import Button from "./UI/Button.jsx";

export default function PreviewSection({ onCustomise }) {
    const sectionRef = useRef(null);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    // Update viewport height on window resize for responsiveness
    useEffect(() => {
        const handleResize = () => setViewportHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const offScreenOffset = viewportHeight * 1.5;
    const {scrollYProgress} = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const rawOpacity = useTransform(
        scrollYProgress,
        [0, 0.3, 0.9, 1],
        [0, 1, 1, 0]
    );

    const rawY = useTransform(
        scrollYProgress,
        [0, 0.1, 0.9, 1],
        [offScreenOffset, 0, 0, offScreenOffset]
    );

    const opacity = useSpring(rawOpacity, {stiffness: 80, damping: 30});
    const y = useSpring(rawY, {stiffness: 80, damping: 30});

    return (
        <div className="container">
            <motion.div
                ref={sectionRef}
                className="preview-section wrapper row"
                style={{opacity, y,}}
                transition={{type: "spring", ease: "easeInOut", duration: 1}}
            >
                <div className="preview-content paper-card col-6 offset-3 justify-content-center text-center">
                    <h2 className="title-chrome">CUSTOMIZE YOUR DICE</h2>
                    <p>
                        You can customize both the material and the shape of your dice. Zoom and rotate to look at it
                        from
                        every angle and add it to your personal cart!
                    </p>
                    <hr className="line w-50 mx-auto"/>
                    <Button className="button"
                            disableActive={true}
                            onClick={onCustomise}>
                        CUSTOMIZE
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}