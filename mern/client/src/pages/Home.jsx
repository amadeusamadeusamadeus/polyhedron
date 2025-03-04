// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { getShapes, getMaterials } from "../api/fetch.jsx";
import Jumbotron from "../components/Jumbotron.jsx";
import ShapeMenu from "../components/ShapeMenu.jsx";
import WebgiViewer from "../components/WebgiViewer.jsx";
import PitchSection from "../components/PitchSection.jsx";
import PreviewSection from "../components/PreviewSection.jsx";
import ShoppingSection from "../components/ShoppingSection.jsx";
import Cart from "../components/Cart.jsx";
import Checkout from "../components/Checkout.jsx";

export default function Home() {
    // 3D viewer & configuration state
    const [modelUrl, setModelUrl] = useState("d4.glb");
    const [currentVariation, setCurrentVariation] = useState();
    const [variations, setVariations] = useState([]);
    const [config, setConfig] = useState(null);

    // DB products state
    const [dbShapes, setDbShapes] = useState([]);
    const [dbMaterials, setDbMaterials] = useState([]);

    // Selected product state
    const [selectedShape, setSelectedShape] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // Fetch shapes and materials on mount
    useEffect(() => {
        async function fetchProductData() {
            try {
                const shapesData = await getShapes();
                console.log("Fetched shapes:", shapesData);
                setDbShapes(shapesData);
                // Set default shape if none is selected.
                if (shapesData.length > 0 && !selectedShape) {
                    handleShapeChange(shapesData[0]);
                }
                const materialsData = await getMaterials();
                console.log("Fetched materials:", materialsData);
                setDbMaterials(materialsData);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        }
        fetchProductData();
    }, []);

    const handleShapeChange = (shape) => {
        console.log("Shape changed to:", shape);
        setModelUrl(shape.modelUrl);
        setSelectedShape(shape);
    };

    const handleSelectVariation = (material) => {
        console.log("User selected material:", material);
        setSelectedMaterial(material);
    };

    return (
        <>
            <Jumbotron />
            <ShapeMenu shapes={dbShapes} onShapeChange={handleShapeChange} />
            <WebgiViewer
                modelUrl={modelUrl}
                onVariationChange={setCurrentVariation}
                setVariations={setVariations}
                setConfig={setConfig}
                dbMaterials={dbMaterials}
                dbShape={selectedShape}
                setDbMaterials={setDbMaterials}
            />
            <PitchSection />
            <PreviewSection />
            <ShoppingSection
                variations={variations}
                config={config}
                onSelectVariation={handleSelectVariation}
                selectedMaterial={selectedMaterial}
            />
            <Cart />
            <Checkout />
        </>
    );
}
