import React, { useEffect } from "react";
import Button from "./UI/Button.jsx";

export default function ShapeMenu({ shapes, onShapeChange }) {
    const handleShapeClick = (shape) => {
        onShapeChange(shape);
    };

    // Optionally preload all icon images
    useEffect(() => {
        shapes.forEach((shape) => {
            const img = new Image();
            img.src = `/icons/${shape.icon}`;
        });
    }, [shapes]);

    return (
        <div className="shape-menu">
            {shapes.map((shape) => (
                <button
                    key={shape._id}
                    onClick={() => handleShapeClick(shape)}
                    style={{ margin: "0.5rem" }}
                >
                    <img className = "shape-icons"
                        src={`/icons/${shape.icon}`}
                        alt={shape.name}
                    />
                </button>
            ))}
        </div>
    );
}
