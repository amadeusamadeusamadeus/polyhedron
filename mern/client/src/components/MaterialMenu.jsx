// src/components/MaterialMenu.jsx
import React from "react";
import Button from "./UI/Button.jsx";

export default function MaterialMenu({ variations, config, onSelectVariation }) {
    async function evaluateClick(material, config) {
        console.log("Click", config);
        console.log("Material", material);
        onSelectVariation(material);
        if (config && config.variations && material.uuid) {
            await config.applyVariation(config.variations[0], material.uuid);
        }
    }

    return (
        <div className="material-menu">
            {variations.map((variation) => (
                <div key={variation.title} className="variation-group">
                    {/*<h3>{variation.title}</h3>*/}
                    <div className="variation-options" style={{ display: "flex", flexWrap: "wrap" }}>
                        {variation.materials.map((material) => {
                            const iconUrl =
                                material && material.userData && material.userData.icon
                                    ? material.userData.icon
                                    : "";//
                            return (
                                <Button
                                    key={material.uuid}
                                    onClick={() => evaluateClick(material, config)}
                                    style={{
                                        backgroundImage: iconUrl ? `url(${iconUrl})` : "none",
                                        width: "50px",
                                        height: "50px",
                                        backgroundSize: "cover",
                                        margin: "0.5rem",
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
