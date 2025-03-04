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
import { ensureMaterialInDb } from "../api/materialService";

export default function WebgiViewer({
                                        modelUrl,
                                        onVariationChange,
                                        setVariations,
                                        setConfig,
                                        dbMaterials,
                                        dbShape,
                                        setDbMaterials
                                    }) {
    const canvasRef = useRef(null);
    const viewerRef = useRef(null);
    const configRef = useRef(null);

    // Merge the variation data from the .glb with DB pricing info.
    const updateVariations = async (configPlugin) => {
        const updatedVariations = await Promise.all(
            configPlugin.variations.map(async (variation) => {
                const newMaterials = await Promise.all(
                    variation.materials.map(async (material) => {
                        const glbId = material.uuid && material.uuid.toString();
                        let matchingDbMaterial = dbMaterials.find(dbMat => dbMat.uuid === glbId);
                        if (!matchingDbMaterial) {
                            // If missing, ensure the material is created in DB.
                            matchingDbMaterial = await ensureMaterialInDb(material);
                            if (matchingDbMaterial) {
                                setDbMaterials(prev => [...prev, matchingDbMaterial]);
                            }
                        }
                        if (matchingDbMaterial && dbShape) {
                            material.price = Number(dbShape.basePrice) + Number(matchingDbMaterial.priceModifier);
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

    // Initial viewer setup.
    useEffect(() => {
        async function setupViewer() {
            if (!canvasRef.current) return;
            const viewer = new ViewerApp({ canvas: canvasRef.current });
            viewerRef.current = viewer;

            await viewer.addPlugin(AssetManagerPlugin);
            await addBasePlugins(viewer);
            await viewer.addPlugin(FileTransferPlugin);
            await viewer.addPlugin(CanvasSnipperPlugin);

            const configPlugin = await viewer.addPlugin(MaterialConfiguratorPlugin);
            configRef.current = configPlugin;
            configPlugin.onVariationChange = (selectedVariation) => {
                console.log("Variation changed:", selectedVariation);
                if (onVariationChange) {
                    onVariationChange(selectedVariation);
                }
            };

            await viewer.load(modelUrl);
            await updateVariations(configPlugin);
            setConfig(configPlugin);
        }
        setupViewer();
    }, [onVariationChange, setVariations, setConfig, modelUrl]);

    // Re-run merge when dbShape or dbMaterials change.
    useEffect(() => {
        console.log("Re-running merge with dbShape:", dbShape, "and dbMaterials:", dbMaterials);
        if (configRef.current && dbShape && dbMaterials.length > 0) {
            updateVariations(configRef.current);
        }
    }, [dbShape, dbMaterials]);

    return (
        <div id="webgi-canvas-container" style={{ width: "100%", height: "600px" }}>
            <canvas id="webgi-canvas" ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
}
