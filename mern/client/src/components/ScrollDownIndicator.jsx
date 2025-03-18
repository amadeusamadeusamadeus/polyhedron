import React, { useState, useEffect } from "react";
import "../ScrollDownIndicator.css";

export default function ScrollDownIndicator({ lastSectionRef }) {
    const [isScrolling, setIsScrolling] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    // Debounce scroll events to determine if the user is actively scrolling.
    useEffect(() => {
        let timeoutId = null;
        const handleScroll = () => {
            setIsScrolling(true);
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    // Use IntersectionObserver to determine when the sentinel is visible.
    useEffect(() => {
        if (!lastSectionRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Adjust the ratio as needed. For example, 0.9 means 90% of the sentinel is visible.
                    if (entry.intersectionRatio >= 1) {
                        setIsAtBottom(true);
                    } else {
                        setIsAtBottom(false);
                    }
                });
            },
            { threshold: [0, 0.5, 0.9, 1.0] }
        );

        observer.observe(lastSectionRef.current);
        return () => observer.disconnect();
    }, [lastSectionRef]);

    // Hide the indicator if the user is scrolling or if the sentinel is visible.
    if (isScrolling || isAtBottom) {
        return null;
    }

    return (
        <div className="scroll-down-overlay">
            <p>SCROLL DOWN</p>
            <p>&#x2193;</p>
        </div>
    );
}
