// src/App.jsx
import React, { useState } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header.jsx";
import WebgiViewer from "./components/WebgiViewer.jsx";
import Jumbotron from "./components/Jumbotron.jsx";
import PitchSection from "./components/PitchSection.jsx";
import PreviewSection from "./components/PreviewSection.jsx";
import ShoppingSection from "./components/ShoppingSection.jsx";
import { CartContextProvider } from "./store/CartContext.jsx";
import { UserProgressContextProvider } from "./store/UserProgressContext.jsx";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout.jsx";
import ShapeMenu from "./components/ShapeMenu.jsx";

function App() {
    // State to hold the current model URL (3D shape).
    const [modelUrl, setModelUrl] = useState("d4.glb");
    const [currentVariation, setCurrentVariation] = useState();
    const [variations, setVariations] = useState([]);
    const [config, setConfig] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const handleSelectVariation = (material) => {
        console.log("User selected material: ", material);
        setSelectedMaterial(material);
    };

    const handleShapeChange = (newModelUrl) => {
        console.log("Shape changed to:", newModelUrl);
        setModelUrl(newModelUrl);
    };

    return (
        <UserProgressContextProvider>
            <CartContextProvider>
                <Header />
                <div className="mt-0 my-1">
                    <hr className="line" />
                </div>
                <Jumbotron />
                {/* Render ShapeMenu so user can switch 3D shapes */}

                {/* Pass the current modelUrl to WebgiViewer */}
                <WebgiViewer
                    modelUrl={modelUrl}
                    onVariationChange={setCurrentVariation}
                    setVariations={setVariations}
                    setConfig={setConfig}
                />
                <PitchSection />
                <PreviewSection />
                <ShoppingSection
                    variations={variations}
                    config={config}
                    onSelectVariation={handleSelectVariation}
                    selectedMaterial={selectedMaterial}
                />
                <ShapeMenu onShapeChange={handleShapeChange} />
                <Cart />
                <Checkout />
            </CartContextProvider>
        </UserProgressContextProvider>
    );
}

export default App;
