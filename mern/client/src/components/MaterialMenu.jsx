// src/components/MaterialMenu.jsx
import React from "react";
import Button from "./UI/Button.jsx";

export default function MaterialMenu({ variations, config, onMaterialSelect }) {
    async function evaluateClick(material) {
        // Notify the parent about the selection.
        onMaterialSelect(material);
        // Apply the material variation to the 3D model if config is available.
        if (config && config.variations && material.uuid) {
            try {
                await config.applyVariation(config.variations[0], material.uuid);
                console.log("Applied variation for material:", material.uuid);
            } catch (error) {
                console.error("Error applying variation:", error);
            }
        }
    }
//TODO: set the default material to something
    return (
        <div className="material-menu">
            {variations.map((variation) => (
                <div key={variation.title} className="variation-group">
                    <div className="variation-options" style={{ display: "flex", flexWrap: "wrap" }}>
                        {variation.materials.map((material) => {
                            const iconUrl = material.userData && material.userData.icon ? material.userData.icon : "";
                            return (
                                <button
                                    key={material.uuid}
                                    onClick={() => evaluateClick(material)}
                                    style={{
                                        backgroundImage: iconUrl ? `url(${iconUrl})` : "none",
                                        width: "50px",
                                        height: "50px",
                                        backgroundSize: "cover",
                                        margin: "0.5rem",
                                        border: 0,
                                    }}
                                >
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
