import React, {useRef, useCallback, useEffect} from "react";
import {
    ViewerApp,
    AssetManagerPlugin,
    addBasePlugins,
    FileTransferPlugin,
    AssetManagerBasicPopupPlugin,
    CanvasSnipperPlugin,
    MaterialConfiguratorPlugin,
    CameraViewPlugin,
    ScrollableCameraViewPlugin,
    TonemapPlugin,
    TweakpaneUiPlugin,
    mobileAndTabletCheck
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimation} from "../lib/scroll-animation.js";

gsap.registerPlugin(ScrollTrigger);

 function WebgiViewer() {
    const canvasRef = useRef(null);

    const memoriseScrollAnimation = useCallback((position, target, onUpdate) => {
        if (position && target && onUpdate) {
            scrollAnimation(position, target, onUpdate);
        }
    }, []
    )


    const setupViewer = useCallback(async () => {
        if (!canvasRef.current) return;

        // Initialize the viewer with your canvas element.
        const viewer = new ViewerApp({
            canvas: canvasRef.current,
        });

        // Add the Asset Manager Plugin.
        const manager = await viewer.addPlugin(AssetManagerPlugin);
        const camera = viewer.scene.activeCamera;
        const position = camera.position;
        const target = camera.target;

        // Add all the base plugins.
        await addBasePlugins(viewer);

        // Add additional plugins.
        await viewer.addPlugin(AssetManagerBasicPopupPlugin);

        await viewer.addPlugin(FileTransferPlugin);
        await viewer.addPlugin(CanvasSnipperPlugin);
        //Scroll camera view later
        // await viewer.addPlugin(ScrollableCameraViewPlugin);


        // Add the default Material Configurator Plugin to automatically display
        // the material configuration UI based on your GLB/GLTF file.
        await viewer.addPlugin(MaterialConfiguratorPlugin);
        // const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin);
        // uiPlugin.setupPlugins(TonemapPlugin, CanvasSnipperPlugin);

        // viewer.renderer.refreshPipeline();


        // Import and add your GLB file (make sure the GLB file includes material configuration).
        // await viewer.load("WebGI.glb");
        await manager.addFromPath("WebGI.glb")

        viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false});
        window.scrollTo(0, 0);

        let needsUpdate = true;
        const onUpdate = () => {
            needsUpdate = true;
            viewer.setDirty();
        }

        viewer.addEventListener("preFrame", () => {
            if (needsUpdate) {
                camera.positionUpdated(true)
                needsUpdate = false;
            }
        });

        memoriseScrollAnimation(position, target, onUpdate);

        // (Optional) If your GLB doesn't set an environment map, you can load one:
        // await viewer.setEnvironmentMap("path/to/your/environment.hdr");


    }, []);

    useEffect(() => {
        setupViewer();
    }, [setupViewer]);

    //TODO:STYLE IN CSS

    return (
        <div id="webgi-canvas-container">
            <canvas id="webgi-canvas" ref={canvasRef} className="d-block w-100 h-100"/>
        </div>
    );
}
export default WebgiViewer
