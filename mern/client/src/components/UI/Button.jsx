import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../Button.css';

export default function Button({
                                   children,
                                   textOnly,
                                   className,
                                   onActive,
                                   isActive: propIsActive = false,  // Default isActive to false if not provided
                                   disableActive = false,  // Prop to completely disable the active functionality
                                   whileHoverScale = 0, // Default scale effect on hover (0 disables scale)
                                   ...props
                               }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActiveState] = useState(false);  // Track if the button is clicked (active)

    // Set `isActive` based on the prop passed or default to local state, but respect `disableActive`
    useEffect(() => {
        if (!disableActive) {
            setIsActiveState(propIsActive);
        }
    }, [propIsActive, disableActive]);

    const cssClasses = [textOnly ? "text-button" : "button", className]
        .filter(Boolean)
        .join(" ");

    // Function to split the text into individual letters and handle spaces
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
                    initial={{ color: 'white' }}  // Text starts as white
                    animate={{
                        color: isHovered || isActive ? 'transparent' : 'white',  // Transition to transparent (gradient) on hover or active
                        background: isHovered || isActive
                            ? 'linear-gradient(30deg, rgb(94, 94, 94) 30%, rgb(172, 172, 172) 50%, rgb(94, 94, 94) 70%)'
                            : 'white',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text', // For Safari compatibility
                    }}
                    transition={{
                        duration: 0.1,  // Duration of the text color change
                        ease: 'easeInOut',
                        delay: isHovered || isActive ? index * 0.03 : (text.length - index) * 0.03, // Reverse delay on hover end
                    }}
                >
                    {letter}
                </motion.span>
            );
        });
    };

    const handleButtonClick = () => {
        if (disableActive) return;  // Do nothing if `disableActive` is true

        const newIsActive = !isActive;
        setIsActiveState(newIsActive);  // Toggle the active state
        if (onActive) onActive(newIsActive);  // Call the passed onActive callback
    };

    return (
        <motion.button
            className={cssClasses}
            onClick={() => { handleButtonClick(); props.onClick && props.onClick(); }}  // Ensure custom onClick is called
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={whileHoverScale ? { scale: whileHoverScale } : undefined} // Optional scale effect on hover
            style={{
                background: 'black',  // Button's background stays solid (black)
            }}
        >
            <motion.div
                className="gradient"
                initial={{ left: '-100%' }}
                animate={{ left: isHovered ? '100%' : '-100%' }} // Animation only on hover
                transition={{
                    duration: 1, // Duration for the gradient effect
                    ease: 'easeInOut',
                }}
            />
            {splitText(children)} {/* Split the text into individual letters */}
        </motion.button>
    );
}
