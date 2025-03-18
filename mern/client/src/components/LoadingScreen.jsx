import React from "react";
import "../LoadingScreen.css";

export default function LoadingScreen({ isLoading, progress }) {
    if (!isLoading) return null;
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <img src="animation.gif" alt="Loading..." />
                <h2>Polyhedron</h2>
                <p>Loading, please wait... {(progress * 100).toFixed(0)}%</p>
            </div>
        </div>
    );
}
