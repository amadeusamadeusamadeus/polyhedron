// src/components/ShapeMenu.jsx
import React from "react";
import Button from "./UI/Button.jsx";

export default function ShapeMenu({ shapes, onShapeChange }) {
    return (
        <div className="shape-menu">
            {shapes.map((shape) => (
                <Button
                    key={shape._id}
                    onClick={() => onShapeChange(shape)}
                    style={{ margin: "0.5rem" }}
                >
                    {shape.name}
                </Button>
            ))}
        </div>
    );
}
