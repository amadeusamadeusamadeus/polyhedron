import React, {useState} from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header.jsx";
import WebgiViewer from "./components/WebgiViewer.jsx";
import Jumbotron from "./components/Jumbotron.jsx";
import PitchSection from "./components/PitchSection.jsx";
import PreviewSection from "./components/PreviewSection.jsx";
import MaterialMenu from "./components/MaterialMenu.jsx";
// import Signup from "./components/Signup.jsx";
import Button from "./components/UI/Button.jsx";
import ShoppingSection from "./components/ShoppingSection.jsx";
import {CartContextProvider} from "./store/CartContext.jsx";
import {UserProgressContextProvider} from "./store/UserProgressContext.jsx";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout.jsx";

function App() {
    // State to hold the currently selected variation and the list of available variations.
    const [currentVariation, setCurrentVariation] = useState();
    const [variations, setVariations] = useState([]);
    const [config, setConfig] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);


    // (Optional) Callback for when a user selects a variation via a menu.
    const handleSelectVariation = (material) => {
        console.log("User selected material: ", material);
        setSelectedMaterial(material)
        // setCurrentVariation(currentVariation);

    };

    return (
        <>
            <UserProgressContextProvider>
                <CartContextProvider>
                    <Header/>
                    <div className="mt-0 my-1">
                        <hr className="line"/>
                    </div>
                    <Jumbotron/>
                    {/* Pass the callbacks into your viewer component */}
                    <WebgiViewer
                        onVariationChange={setCurrentVariation}
                        setVariations={setVariations}
                        setConfig={setConfig}
                    />
                    <PitchSection/>
                    <PreviewSection/>
                    <ShoppingSection
                        variations={variations}
                        config={config}
                        onSelectVariation={handleSelectVariation}
                        selectedMaterial={selectedMaterial}
                    />
                    <Cart/>
                    <Checkout/>

                    {/* Simple UI to show the current variation */}
                    {/*<div className="variation-info p-3">*/}
                    {/*    {currentVariation ? (*/}
                    {/*        <div>*/}
                    {/*            <h2>Current Variation</h2>*/}
                    {/*            <pre>{JSON.stringify(currentVariation, null, 2)}</pre>*/}
                    {/*        </div>*/}
                    {/*    ) : (*/}
                    {/*        <p>No variation selected yet</p>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                </CartContextProvider>
            </UserProgressContextProvider>
        </>
    );
}

export default App;
