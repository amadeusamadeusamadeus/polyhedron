// src/components/MaterialMenu.jsx
import React from "react";

export default function MaterialMenu({ variations, onSelectVariation }) {
    return (
        <div className="material-menu">
            {variations.map((variation) => (
                <div key={variation.title} className="variation-group">
                    <h3>{variation.title}</h3>
                    <div className="variation-options" style={{ display: "flex", flexWrap: "wrap" }}>
                        {variation.materials.map((material, index) => {
                            let preview;
                            if (!variation.preview.startsWith("generate:")) {
                                const pp = material[variation.preview] || "#ff00ff";
                                preview = pp.image || pp;
                            } else {
                                const shape = variation.preview.split(":")[1];
                                // Optionally, generate a preview image if your plugin provides a method.
                                preview = ""; // Fallback – you might call configPlugin.getPreview(material, variation.preview)
                            }
                            return (
                                <button
                                    key={material.uuid}
                                    onClick={() => onSelectVariation(variation, index)}
                                    style={{
                                        backgroundImage: `url(${preview})`,
                                        width: "50px",
                                        height: "50px",
                                        backgroundSize: "cover",
                                        margin: "0.5rem"
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
