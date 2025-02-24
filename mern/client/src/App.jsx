import React, { useState } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header.jsx";
import WebgiViewer from "./components/WebgiViewer.jsx";
import Jumbotron from "./components/Jumbotron.jsx";
import PitchSection from "./components/PitchSection.jsx";
import PreviewSection from "./components/PreviewSection.jsx";
import MaterialMenu from "./components/MaterialMenu.jsx";
import Signup from "./components/Signup.jsx";

function App() {
    // State to hold the currently selected variation and the list of available variations.
    const [currentVariation, setCurrentVariation] = useState();
    const [variations, setVariations] = useState([]);
    const [config, setConfig] = useState([]);

    // (Optional) Callback for when a user selects a variation via a menu.
    const handleSelectVariation = (variation, index) => {
        console.log("User selected variation:", variation, index);
        // Here you could trigger an API call or update state as needed.
    };

    return (
        <>
            <Header />
            <div className="mt-0 my-1">
                <hr className="line" />
            </div>
            <Jumbotron />
            {/* Pass the callbacks into your viewer component */}
            <WebgiViewer
                onVariationChange={setCurrentVariation}
                setVariations={setVariations}
                setConfig={setConfig}
            />
            <PitchSection />
            <PreviewSection />
            {/* Render the MaterialMenu if you have variations */}
            <div className="variation-menu p-3">
                {variations && variations.length > 0 ? (
                    <MaterialMenu
                        variations={variations}
                        config={config}
                        onSelectVariation={handleSelectVariation}
                    />
                ) : (
                    <p>No variations available</p>
                )}
            </div>

            {/* Simple UI to show the current variation */}
            <div className="variation-info p-3">
                {currentVariation ? (
                    <div>
                        <h2>Current Variation</h2>
                        <pre>{JSON.stringify(currentVariation, null, 2)}</pre>
                    </div>
                ) : (
                    <p>No variation selected yet</p>
                )}
            </div>
        </>
    );
}

export default App;
