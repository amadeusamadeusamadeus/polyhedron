import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    ViewerApp,
    AssetManagerPlugin,
    addBasePlugins,
    FileTransferPlugin,
    CanvasSnipperPlugin,
    MaterialConfiguratorPlugin,
    ScrollableCameraViewPlugin,
} from "webgi";
import { ensureMaterialInDb } from "../api/materialService";

export default function WebgiViewer({
                                        mode,
                                        modelUrl,
                                        onVariationChange,
                                        setVariations,
                                        setConfig,
                                        dbMaterials,
                                        dbShape,
                                        setDbMaterials,
                                        onViewerLoaded,
                                        selectedMaterial,
                                    }) {
    const canvasRef = useRef(null);
    const viewerRef = useRef(null);
    const configRef = useRef(null);
    const scrollRef = useRef(null);
    const location = useLocation();
    const isHomePage = location.pathname === "/" || location.pathname === "/home";
    const [isLoaded, setIsLoaded] = useState(false);

    const dbMaterialsRef = useRef(dbMaterials);
    useEffect(() => {
        dbMaterialsRef.current = dbMaterials;
    }, [dbMaterials]);

    const updateVariations = async (configPlugin) => {
        const updatedVariations = await Promise.all(
            configPlugin.variations.map(async (variation) => {
                const newMaterials = await Promise.all(
                    variation.materials.map(async (material) => {
                        const glbId = material.uuid && material.uuid.toString();
                        let matchingDbMaterial = dbMaterials.find(
                            (dbMat) => dbMat.uuid === glbId
                        );
                        if (!matchingDbMaterial) {
                            matchingDbMaterial = await ensureMaterialInDb(material);
                            if (matchingDbMaterial) {
                                setDbMaterials((prev) => [...prev, matchingDbMaterial]);
                            }
                        }
                        if (matchingDbMaterial && dbShape) {
                            material.price =
                                Number(dbShape.basePrice) +
                                Number(matchingDbMaterial.priceModifier);
                        } else {
                            material.price = null;
                            console.warn(
                                "Price not set for material:",
                                material.uuid,
                                "dbShape:",
                                dbShape,
                                "matchingDbMaterial:",
                                matchingDbMaterial
                            );
                        }
                        return material;
                    })
                );
                return { ...variation, materials: newMaterials };
            })
        );
        console.log("Merged variations with pricing:", updatedVariations);
        setVariations(updatedVariations);
    };

    // Initialize the viewer
    useEffect(() => {
        async function setupViewer() {
            if (!canvasRef.current) return;

            if (viewerRef.current) {
                viewerRef.current.dispose();
                viewerRef.current = null;
            }
            setIsLoaded(false);

            const viewer = new ViewerApp({ canvas: canvasRef.current });
            viewerRef.current = viewer;
            //Add plugins
            await viewer.addPlugin(AssetManagerPlugin);
            await addBasePlugins(viewer);
            await viewer.addPlugin(FileTransferPlugin);
            await viewer.addPlugin(CanvasSnipperPlugin);

            if (isHomePage && mode === "scroll") {
                const scrollPlugin = await viewer.addPlugin(ScrollableCameraViewPlugin);
                scrollRef.current = scrollPlugin;
            }

            const configPlugin = await viewer.addPlugin(MaterialConfiguratorPlugin);
            configRef.current = configPlugin;
            configPlugin.onVariationChange = (selectedVariation) => {
                console.log("Variation changed:", selectedVariation);
                if (onVariationChange) onVariationChange(selectedVariation);
            };

            await viewer.load(modelUrl);
            await updateVariations(configPlugin);
            setConfig(configPlugin);

            // // Set initial camera controls based on mode.
            // viewer.scene.activeCamera.controls.enabled = mode !== "scroll";

            if (onViewerLoaded) onViewerLoaded();
            setIsLoaded(true);
        }
        setupViewer();

        return () => {
            if (viewerRef.current) {
                viewerRef.current.dispose();
                viewerRef.current = null;
            }
        };
    }, [modelUrl, isHomePage, onVariationChange, setVariations, setConfig, dbShape, mode]);

    useEffect(() => {
        if (!viewerRef.current) return;
        const viewer = viewerRef.current;

        if (mode !== "scroll" || !isHomePage) {
            if (scrollRef.current) {
                viewer.removePlugin(scrollRef.current);
                scrollRef.current = null;
            }
        }

        if (mode === "scroll" && isHomePage) {

            (async () => {
                if (!scrollRef.current) {
                    const scrollPlugin = await viewer.addPlugin(ScrollableCameraViewPlugin);
                    scrollRef.current = scrollPlugin;
                }
                scrollRef.current.enabled = true;
            })();


            // Disable camera controls and pointer events in scroll mode.
            viewer.scene.activeCamera.controls.enabled = false;
            if (canvasRef.current) {
                canvasRef.current.style.pointerEvents = "none";
            }
        } else if (mode === "customise") {
            // In customise mode, ensure camera controls and pointer events are enabled.
            viewer.scene.activeCamera.controls.enabled = true;
            if (canvasRef.current) {
                canvasRef.current.style.pointerEvents = "auto";
            }
            // Ensure the interaction plugin is enabled.
        }
    }, [mode, isHomePage]);

    // When switching to scroll mode, reapply the selected material variation.
    useEffect(() => {
        if (mode === "scroll" && configRef.current && selectedMaterial) {
            const variation = configRef.current.variations.find((v) =>
                v.materials.some((m) => m.uuid === selectedMaterial.uuid)
            );
            if (variation && configRef.current.applyVariation) {
                configRef.current.applyVariation(variation, selectedMaterial.uuid);
            }
        }
    }, [mode, selectedMaterial]);

    // Update variations if the shape or materials change.
    useEffect(() => {
        if (configRef.current && dbShape && dbMaterials.length > 0) {
            updateVariations(configRef.current);
        }
    }, [dbShape, dbMaterials]);

    // Force a scroll update once the viewer is loaded and in scroll mode.
    useEffect(() => {
        if (isLoaded && mode === "scroll") {
            window.dispatchEvent(new Event("scroll"));
        }
    }, [isLoaded, mode]);

    return (
        <div id="webgi-canvas-container" style={{ width: "100%", height: "100%" }}>
            <canvas
                id="webgi-canvas"
                ref={canvasRef}
                style={{ width: "100%", height: "100%" }}
            />
            {!isLoaded && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
            )}
        </div>
    );
}
