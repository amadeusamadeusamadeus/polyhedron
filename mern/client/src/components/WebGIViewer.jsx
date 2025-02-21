// src/components/WebgiViewer.jsx
import React, { useRef, useEffect } from "react";
import {
    ViewerApp,
    AssetManagerPlugin,
    addBasePlugins,
    FileTransferPlugin,
    CanvasSnipperPlugin,
    TonemapPlugin, MaterialConfiguratorPlugin,
} from "webgi";
import { CustomMaterialConfiguratorPlugin } from "../plugins/CustomMaterialConfiguratorPlugin";

export default function WebgiViewer({ onVariationChange, setVariations }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        async function setupViewer() {
            if (!canvasRef.current) return;

            // Initialize the viewer.
            const viewer = new ViewerApp({ canvas: canvasRef.current });

            // Add essential plugins.
            await viewer.addPlugin(AssetManagerPlugin);
            await addBasePlugins(viewer);
            await viewer.addPlugin(FileTransferPlugin);
            await viewer.addPlugin(CanvasSnipperPlugin);

            // Add our custom Material Configurator Plugin.
            const configPlugin = await viewer.addPlugin(CustomMaterialConfiguratorPlugin);

            // Disable the default UI so only our custom menu is used.
            // viewer.getPlugin(MaterialConfiguratorPlugin).uiConfig.hidden = true;

            // Set up the callback to track variation changes.
            configPlugin.onVariationChange = (selectedVariation) => {
                console.log("Variation changed:", selectedVariation);
                if (onVariationChange) {
                    onVariationChange(selectedVariation);
                }
            };

            // Load your GLB model that includes material configuration data.
            await viewer.load("D20Test.glb");

            // After loading, update available variations.
            setVariations(configPlugin.variations);

            // Optional: Additional viewer configuration.
            viewer.getPlugin(TonemapPlugin).config.clipBackground = true;
        }
        setupViewer();
    }, [onVariationChange, setVariations]);

    return (
        <div id="webgi-canvas-container" style={{ width: "100%", height: "600px" }}>
            <canvas id="webgi-canvas" ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
}
