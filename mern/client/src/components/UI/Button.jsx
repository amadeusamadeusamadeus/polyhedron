import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../Button.css';

export default function Button({
                                   children,
                                   textOnly,
                                   className,
                                   onActive,
                                   isActive: propIsActive = false,
                                   disableActive = false,
                                   whileHoverScale = 0.9,
                                   ...props
                               }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActiveState] = useState(false);

    useEffect(() => {
        if (!disableActive) {
            setIsActiveState(propIsActive);
        }
    }, [propIsActive, disableActive]);

    const cssClasses = [textOnly ? "text-button" : "button", className]
        .filter(Boolean)
        .join(" ");

    const splitText = (text) => {
        if (typeof text !== 'string') return text;

        return text.split('').map((letter, index) => {
            if (letter === ' ') {
                return (
                    <span key={index} className="text-letter-space"> </span>
                );
            }
            return (
                <motion.span
                    key={index}
                    className="text-letter"
                    initial={{ color: 'white' }}
                    animate={{
                        color: isHovered || isActive ? 'transparent' : 'white',
                        backgroundImage: isHovered || isActive
                            ? 'linear-gradient(30deg, rgb(94, 94, 94) 30%, rgb(172, 172, 172) 50%, rgb(94, 94, 94) 70%)'
                            : 'none',  // Default to none, preventing background animation issues
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text', // For Safari compatibility
                    }}
                    transition={{
                        duration: 0.1,
                        ease: 'easeInOut',
                        delay: isHovered || isActive ? index * 0.01 : (text.length - index) * 0.01,
                    }}
                >
                    {letter}
                </motion.span>
            );
        });
    };

    const handleButtonClick = () => {
        if (disableActive) return;

        const newIsActive = !isActive;
        setIsActiveState(newIsActive);
        if (onActive) onActive(newIsActive);
    };

    return (
        <motion.button
            className={cssClasses}
            onClick={() => { handleButtonClick(); props.onClick && props.onClick(); }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={whileHoverScale ? { scale: whileHoverScale } : undefined}
            style={{
                background: 'black',  // Solid background color
            }}
        >
            <motion.div
                className="gradient"
                initial={{ left: '-100%' }}
                animate={{ left: isHovered ? '100%' : '-100%' }}
                transition={{
                    duration: 1,
                    ease: 'easeInOut',
                }}
            />
            {splitText(children)}
        </motion.button>
    );
}
