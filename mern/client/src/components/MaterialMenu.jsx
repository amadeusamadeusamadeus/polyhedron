// src/components/MaterialMenu.jsx
import React from "react";
import Button from "./UI/Button.jsx"

export default function MaterialMenu({ variations, config, onSelectVariation }) {

    async function evaluateClick(uuid, materialName, config) {
        console.log("Click", config)
        console.log("Name", materialName)
        onSelectVariation({id: uuid, name: materialName})
        await config.applyVariation(config.variations[0], uuid)
    }

    return (
        <div className="material-menu">
            {variations.map((variation) => (
                <div key={variation.title} className="variation-group">
                    <h3>{variation.title}</h3>
                    <div className="variation-options" style={{ display: "flex", flexWrap: "wrap" }}>
                        {variation.materials.map(material => {
                            // let preview;
                            // if (!variation.preview.startsWith("generate:")) {
                            //     const pp = material[variation.preview] || "#ff00ff";
                            //     preview = pp.image || pp;
                            // } else {
                            //     const shape = variation.preview.split(":")[1];
                            //     // Optionally, generate a preview image if your plugin provides a method.
                            //     preview = ""; // Fallback – you might call configPlugin.getPreview(material, variation.preview)
                            // }
                            return (
                                <Button
                                    key={material.uuid}
                                    onClick={() => evaluateClick(material.uuid, material.name,  config)}
                                    style={{
                                        backgroundImage: `url(${material.userData.icon})`,
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
