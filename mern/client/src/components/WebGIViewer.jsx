// src/components/WebgiViewer.jsx
import React, { useRef, useEffect } from "react";
import {
    ViewerApp,
    AssetManagerPlugin,
    addBasePlugins,
    FileTransferPlugin,
    CanvasSnipperPlugin,
    MaterialConfiguratorPlugin
} from "webgi";

export default function WebgiViewer({ modelUrl, onVariationChange, setVariations, setConfig }) {
    const canvasRef = useRef(null);
    const viewerRef = useRef(null);

    // Custom function to determine price for a material.
    const getPriceForMaterial = (material) => {
        let price = 0;
        if (material.name.includes("metal")) {
            price = 99.99;
        } else {
            price = 199.99;
        }
        return price;
    };

    // Update the variations to include price in each material.
    const updateVariationsWithPrice = (configPlugin) => {
        const updatedVariations = configPlugin.variations.map((variation) => ({
            ...variation,
            materials: variation.materials.map((material) => ({
                ...material,
                price: getPriceForMaterial(material)
            }))
        }));
        console.log("Available variations with price:", updatedVariations);
        setVariations(updatedVariations);
    };

    useEffect(() => {
        async function setupViewer() {
            if (!canvasRef.current) return;

            // Initialize the viewer.
            const viewer = new ViewerApp({ canvas: canvasRef.current });
            viewerRef.current = viewer;

            // Add essential plugins.
            await viewer.addPlugin(AssetManagerPlugin);
            await addBasePlugins(viewer);
            await viewer.addPlugin(FileTransferPlugin);
            await viewer.addPlugin(CanvasSnipperPlugin);

            // Add Material Configurator Plugin.
            const configPlugin = await viewer.addPlugin(MaterialConfiguratorPlugin);
            configPlugin.onVariationChange = (selectedVariation) => {
                console.log("Variation changed:", selectedVariation);
                if (onVariationChange) {
                    onVariationChange(selectedVariation);
                }
            };

            // Load the model using the provided modelUrl.
            await viewer.load(modelUrl);

            // console.log(configPlugin);

            // Update variations to include price information.
            updateVariationsWithPrice(configPlugin);
            setConfig(configPlugin);
        }

        setupViewer();
    }, [onVariationChange, setVariations, setConfig, modelUrl]); // Re-run when modelUrl changes

    return (
        <div id="webgi-canvas-container" style={{ width: "100%", height: "600px" }}>
            <canvas id="webgi-canvas" ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
}
