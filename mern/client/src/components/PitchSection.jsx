import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Button from "./UI/Button.jsx"
import "../Button.css"

export default function PitchSection({ onCustomise }) {
    const sectionRef = useRef(null);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Instead of being completely off-screen, start with a modest offset.
    // For instance, let's use 10% of the viewport width.
    const initialOffset = viewportWidth * 0.1;

    // Use scroll tracking as before.
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Map scroll progress to opacity:
    // When scrollYProgress is 0, the element is slightly shifted and transparent,
    // then it animates to full opacity when it’s in its resting position.
    const rawOpacity = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        [0, 1, 1, 0]
    );
    const opacitySpring = useSpring(rawOpacity, { stiffness: 80, damping: 30 });

    // Map scroll progress to horizontal (x) position:
    // Start at a slight offset (initialOffset) and animate to 0.
    const rawX = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        [initialOffset, 0, 0, initialOffset]
    );
    const xSpring = useSpring(rawX, { stiffness: 80, damping: 30 });

    const handleExplore = () => {
        const element = document.querySelector('.preview-section');
        if (element) {
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementTop,
                left: 0,
                behavior: "smooth"
            });
        }
    };

    return (
        <motion.div
            ref={sectionRef}
            className="pitch-section wrapper row"
            style={{ opacity: opacitySpring, x: xSpring }}
        >
            <div className="pitch-content paper-card col-6 offset-6 align-content-top text-end">
                <h2 className="title-chrome pitch-title ">TRY IT BELOW</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, architecto autem cumque debitis
                    dignissimos distinctio dolores esse est ex, labore libero nisi perferendis quae sunt, suscipit ullam
                    veritatis! Ad animi aspernatur beatae delectus dignissimos dolor doloremque ea esse et id illo iste
                    mollitia necessitatibus nemo quasi quis sed, ullam, voluptatem
                </p>
                <hr className="line w-50 ms-auto" />
                <Button onClick={handleExplore}>SCROLL DOWN</Button>
            </div>
        </motion.div>
    );
}
