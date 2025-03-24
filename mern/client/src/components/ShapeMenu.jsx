// src/components/ShapeMenu.jsx
import React from "react";
import Button from "./UI/Button.jsx";

export default function ShapeMenu({ shapes, onShapeChange }) {
    const handleShapeClick = (shape) => {
        onShapeChange(shape);
    };

    return (
        <div className="shape-menu">
            {shapes.map((shape) => (
                <Button
                    isActive={false}
                    key={shape._id}
                    onClick={() => handleShapeClick(shape)}  // Pass the selected shape
                    style={{ margin: "0.5rem" }}
                >
                    {shape.name}
                </Button>
            ))}
        </div>
    );
}
