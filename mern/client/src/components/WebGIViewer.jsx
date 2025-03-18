// src/components/WebgiViewer.jsx
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
                                    }) {
    const canvasRef = useRef(null);
    const viewerRef = useRef(null);
    const configRef = useRef(null);
    const scrollRef = useRef(null);
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const [isLoaded, setIsLoaded] = useState(false);

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

    useEffect(() => {
        async function setupViewer() {
            if (!canvasRef.current) return;
            const viewer = new ViewerApp({ canvas: canvasRef.current });
            viewerRef.current = viewer;

            await viewer.addPlugin(AssetManagerPlugin);
            await addBasePlugins(viewer);
            await viewer.addPlugin(FileTransferPlugin);
            await viewer.addPlugin(CanvasSnipperPlugin);


            // Conditionally add the scroll plugin if on the homepage.
            if (isHomePage) {
                const hasScrollSections = !!document.querySelector("#view1");
                if (hasScrollSections) {
                    const scrollPlugin = await viewer.addPlugin(ScrollableCameraViewPlugin);
                    scrollRef.current = scrollPlugin;
                    scrollPlugin.enabled = mode === "scroll";
                } else {
                    console.warn(
                        "No scroll sections found. Skipping ScrollableCameraViewPlugin initialization."
                    );
                }
            }

            // Add the material configurator plugin.
            const configPlugin = await viewer.addPlugin(MaterialConfiguratorPlugin);
            configRef.current = configPlugin;
            configPlugin.onVariationChange = (selectedVariation) => {
                console.log("Variation changed:", selectedVariation);
                if (onVariationChange) {
                    onVariationChange(selectedVariation);
                }
            };

            // Start loading the model.
            await viewer.load(modelUrl);
            await updateVariations(configPlugin);
            setConfig(configPlugin);

            // Set camera controls based on mode.
            if (mode === "scroll") {
                viewer.scene.activeCamera.controls.enabled = false;
            } else {
                viewer.scene.activeCamera.controls.enabled = true;
            }

            if (onViewerLoaded) onViewerLoaded();
            setIsLoaded(true);
        }
        setupViewer();

        // Cleanup: Dispose viewer when the component unmounts.
        return () => {
            if (viewerRef.current) {
                viewerRef.current.dispose();
                viewerRef.current = null;
            }
        };
    }, [onVariationChange, setVariations, setConfig, modelUrl, isHomePage]);

    useEffect(() => {
        if (!viewerRef.current) return;
        const viewer = viewerRef.current;
        if (isHomePage) {
            if (!scrollRef.current) {
                (async () => {
                    const hasScrollSections = !!document.querySelector("#view1");
                    if (hasScrollSections) {
                        const scrollPlugin = await viewer.addPlugin(ScrollableCameraViewPlugin);
                        scrollRef.current = scrollPlugin;
                        scrollPlugin.enabled = mode === "scroll";
                    }
                })();
            } else {
                scrollRef.current.enabled = mode === "scroll";
            }
        } else {
            if (scrollRef.current) {
                viewer.removePlugin(scrollRef.current);
                scrollRef.current = null;
            }
        }
    }, [isHomePage, mode]);

    useEffect(() => {
        if (!viewerRef.current) return;
        const viewer = viewerRef.current;
        if (scrollRef.current) {
            if (mode === "scroll") {
                viewer.scene.activeCamera.controls.enabled = false;
                if (canvasRef.current) {
                    canvasRef.current.style.pointerEvents = "none";
                }
            } else if (mode === "customise") {
                viewer.scene.activeCamera.controls.enabled = true;
                if (canvasRef.current) {
                    canvasRef.current.style.pointerEvents = "auto";
                }
            }
        }
    }, [mode]);

    // Re-run merge when dbShape or dbMaterials change.
    useEffect(() => {
        console.log("Re-running merge with dbShape:", dbShape, "and dbMaterials:", dbMaterials);
        if (configRef.current && dbShape && dbMaterials.length > 0) {
            updateVariations(configRef.current);
        }
    }, [dbShape, dbMaterials]);

    return (
        <div
            id="webgi-canvas-container"
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <canvas
                id="webgi-canvas"
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                }}
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
