// src/components/ShapeMenu.jsx
import React from "react";
import Button from "./UI/Button.jsx";

const availableShapes = [
    { label: "D4", url: "d4.glb" },
    { label: "D20", url: "D20Test.glb" },
    // Add more shapes as needed.
];

export default function ShapeMenu({ onShapeChange }) {
    return (
        <div className="shape-menu">
            {availableShapes.map((shape) => (
                <Button key={shape.url} onClick={() => onShapeChange(shape.url)}>
                    {shape.label}
                </Button>
            ))}
        </div>
    );
}
