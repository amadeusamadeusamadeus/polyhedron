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
                                        mode, // "scroll" or "customise"
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

    // Keep a ref of the latest dbMaterials for use in updateVariations.
    const dbMaterialsRef = useRef(dbMaterials);
    useEffect(() => {
        dbMaterialsRef.current = dbMaterials;
    }, [dbMaterials]);

    // Updates material variations, including price adjustments.
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

    // --- Initialization Effect ---
    // Runs once when critical props (like modelUrl) change.
    useEffect(() => {
        async function setupViewer() {
            if (!canvasRef.current) return;

            // Dispose any existing viewer.
            if (viewerRef.current) {
                viewerRef.current.dispose();
                viewerRef.current = null;
            }
            setIsLoaded(false);

            const viewer = new ViewerApp({ canvas: canvasRef.current });
            viewerRef.current = viewer;

            // Add base plugins.
            await viewer.addPlugin(AssetManagerPlugin);
            await addBasePlugins(viewer);
            await viewer.addPlugin(FileTransferPlugin);
            await viewer.addPlugin(CanvasSnipperPlugin);

            // Always add the material configurator plugin.
            const configPlugin = await viewer.addPlugin(MaterialConfiguratorPlugin);
            configRef.current = configPlugin;
            configPlugin.onVariationChange = (selectedVariation) => {
                console.log("Variation changed:", selectedVariation);
                if (onVariationChange) onVariationChange(selectedVariation);
            };

            await viewer.load(modelUrl);
            await updateVariations(configPlugin);
            setConfig(configPlugin);

            // If the initial mode is "scroll" on the homepage, add the scroll plugin.
            if (mode === "scroll" && isHomePage) {
                const scrollPlugin = await viewer.addPlugin(ScrollableCameraViewPlugin);
                scrollRef.current = scrollPlugin;
                scrollRef.current.enabled = true;
                // Disable camera controls and pointer events.
                viewer.scene.activeCamera.controls.enabled = false;
                if (canvasRef.current) {
                    canvasRef.current.style.pointerEvents = "none";
                }
                // Use double requestAnimationFrame to ensure the plugin's internal state is settled.
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        window.dispatchEvent(new Event("scroll"));
                        window.dispatchEvent(new Event("resize"));
                    });
                });
            }

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
    }, [modelUrl, isHomePage, onVariationChange, setVariations, setConfig, dbShape]);

    // --- Mode-Specific Effect ---
    // Handles transitions between scroll and customise modes without reinitialising the viewer.
    useEffect(() => {
        if (!viewerRef.current || !isLoaded) return;
        const viewer = viewerRef.current;

        if (mode === "customise") {
            // Remove the scroll plugin (if it exists) so that camera controls can be enabled.
            if (scrollRef.current) {
                viewer.removePlugin(scrollRef.current);
                scrollRef.current = null;
            }
            // Re-enable camera controls and pointer events.
            requestAnimationFrame(() => {
                viewer.scene.activeCamera.controls.enabled = true;
                if (canvasRef.current) {
                    canvasRef.current.style.pointerEvents = "auto";
                }
            });
        } else if (mode === "scroll" && isHomePage) {
            // Re-add the scroll plugin if needed.
            (async () => {
                if (!scrollRef.current) {
                    const scrollPlugin = await viewer.addPlugin(ScrollableCameraViewPlugin);
                    scrollRef.current = scrollPlugin;
                }
                scrollRef.current.enabled = true;
                // Disable camera controls and pointer events.
                viewer.scene.activeCamera.controls.enabled = false;
                if (canvasRef.current) {
                    canvasRef.current.style.pointerEvents = "none";
                }
                // If a material was picked, reapply its variation.
                if (configRef.current && selectedMaterial) {
                    const variation = configRef.current.variations.find((v) =>
                        v.materials.some((m) => m.uuid === selectedMaterial.uuid)
                    );
                    if (variation && configRef.current.applyVariation) {
                        configRef.current.applyVariation(variation, selectedMaterial.uuid);
                    }
                }
                // Trigger scroll events using double RAF to ensure the scroll plugin updates.
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        window.dispatchEvent(new Event("scroll"));
                        window.dispatchEvent(new Event("resize"));
                    });
                });
            })();
        }
    }, [mode, isLoaded, isHomePage, selectedMaterial]);

    return (
        <div id="webgi-canvas-container" style={{ width: "100%", height: "100%" }}>
            <canvas
                id="webgi-canvas"
                ref={canvasRef}
                style={{ width: "100%", height: "100%" }}
            />
            {!isLoaded && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
            )}
        </div>
    );
}
