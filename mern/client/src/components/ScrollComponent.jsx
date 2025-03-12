// src/components/ScrollComponent.jsx
import React, { useRef, useEffect } from "react";
import {
    ViewerApp,
    AssetManagerPlugin,
    addBasePlugins,
    FileTransferPlugin,
    CanvasSnipperPlugin,
    ScrollableCameraViewPlugin
} from "webgi";

export default function ScrollComponent({ modelUrl }) {
    const canvasRef2 = useRef(null);
    const viewerRef2 = useRef(null);

    useEffect(() => {
        async function setupViewer() {
            if (!canvasRef2.current) return;

            // Create the WebGI viewer instance
            const viewer2 = new ViewerApp({ canvas: canvasRef2.current });
            viewerRef2.current = viewer2;

            // Add required plugins
            await viewer2.addPlugin(AssetManagerPlugin);
            await addBasePlugins(viewer2);
            await viewer2.addPlugin(FileTransferPlugin);
            await viewer2.addPlugin(CanvasSnipperPlugin);

            // Add the scrollable camera plugin
            const scrollableCameraPlugin = await viewer2.addPlugin(ScrollableCameraViewPlugin);
            // Ensure it's enabled so that scroll events trigger camera transitions


            // Load the model (e.g., the scroll version of your WebGI scene)
            await viewer2.load(modelUrl);

            // Optionally, add any additional configuration or callbacks
        }
        setupViewer();
    }, [modelUrl]);

    return (
        <div id="scroll-canvas-container" className="scroll-canvas-container">
            <canvas id="scroll-canvas" ref={canvasRef2} className="scroll-canvas" />
        </div>
    );
}
