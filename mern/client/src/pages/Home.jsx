import React, {useState, useEffect, useRef} from "react";
import {getShapes, getMaterials} from "../api/fetch.jsx";
import Jumbotron from "../components/Jumbotron.jsx";
import WebgiViewer from "../components/WebgiViewer.jsx";
import PitchSection from "../components/PitchSection.jsx";
import PreviewSection from "../components/PreviewSection.jsx";
import ShoppingSection from "../components/ShoppingSection.jsx";
import Checkout from "../components/Checkout.jsx";
import CartModal from "../components/CartModal.jsx";
import gsap from "gsap";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useLocation} from "react-router-dom"
import Button from "../components/UI/Button.jsx"
import "../index.css";
import ScrollDownIndicator from "../components/ScrollDownIndicator.jsx";

export default function Home() {
    // 3D viewer & configuration state
    const [modelUrl, setModelUrl] = useState("");
    const [currentVariation, setCurrentVariation] = useState();
    const [variations, setVariations] = useState([]);
    const [config, setConfig] = useState(null);
    const [mode, setMode] = useState("scroll"); // "scroll" or "customise"
    const [isLoading, setIsLoading] = useState(true);
    const [savedScrollPos, setSavedScrollPos] = useState(0);
    const [loadingStart, setLoadingStart] = useState(Date.now());

    // DB products state
    const [dbShapes, setDbShapes] = useState([]);
    const [dbMaterials, setDbMaterials] = useState([]);

    // Selected product state
    const [selectedShape, setSelectedShape] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const viewerContainerRef = useRef(null);

    const location = useLocation();

    const [progress, setProgress] = useState(0);
    const minLoadingTime = 2000;

    useEffect(() => {

        async function fetchProductData() {
            try {
                const shapesData = await getShapes();
                console.log("Fetched shapes:", shapesData);
                setDbShapes(shapesData);
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

    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => {
            const elapsed = Date.now() - loadingStart;
            const newProgress = Math.min(elapsed / minLoadingTime, 1);
            setProgress(newProgress);
            if (newProgress >= 1) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, [isLoading, loadingStart]);


    const handleShapeChange = (shape) => {
        console.log("Shape changed to:", shape);
        setModelUrl(shape.modelUrl);
        setSelectedShape(shape);
    };

    const handleSelectVariation = (material) => {
        console.log("User selected material:", material);
        setSelectedMaterial(material);
    };

    // When entering customize mode, record current scroll and switch modes.
    const handleCustomise = () => {
        const currentPos = window.scrollY || document.documentElement.scrollTop;
        setSavedScrollPos(currentPos);
        gsap.to(viewerContainerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                setMode("customise");
                gsap.to(viewerContainerRef.current, {opacity: 1, duration: 0.5});
            },
        });
        document.body.style.overflow = "hidden";
    };

    const handleExitCustomise = () => {
        gsap.to(viewerContainerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                setMode("scroll");
                gsap.to(viewerContainerRef.current, {opacity: 1, duration: 0.5});
                window.scrollTo({top: savedScrollPos, behavior: "auto"});
            },
        });
        document.body.style.overflow = "auto";
    };

    const viewerContainerStyle =
        mode === "scroll"
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                opacity: 1,
                transition: "opacity 0.5s",
            }
            : {
                position: "absolute",
                top: `${savedScrollPos}px`,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                opacity: 1,
                transition: "opacity 0.5s",
            };

    return (
        <>
            <LoadingScreen isLoading={isLoading} progress={progress}/>
            <ScrollDownIndicator />
            <div ref={viewerContainerRef} style={viewerContainerStyle}>
                <WebgiViewer
                    mode={mode}
                    modelUrl={modelUrl}
                    onVariationChange={setCurrentVariation}
                    setVariations={setVariations}
                    setConfig={setConfig}
                    dbMaterials={dbMaterials}
                    dbShape={selectedShape}
                    setDbMaterials={setDbMaterials}
                    onViewerLoaded={() => {
                        const elapsed = Date.now() - loadingStart;
                        const remaining = Math.max(0, minLoadingTime - elapsed);
                        setTimeout(() => {
                            setIsLoading(false);
                        }, remaining);
                    }}
                />
            </div>

            {mode === "scroll" && (
                <>
                    <section id="view2" className="section">
                        <div className="jumbotron-section-wrapper">
                            <Jumbotron/>
                        </div>
                    </section>
                    <section id="view3" className="section">
                        <div className="pitch-section-wrapper">
                            <PitchSection/>
                        </div>
                    </section>
                    <section id="view4" className="section">
                        <div className="preview-section-wrapper">
                            <PreviewSection onCustomise={handleCustomise}/>
                        </div>
                    </section>
                </>
            )}

            {mode === "customise" && (
                <div className="customise-controls">
                    <ShoppingSection
                        variations={variations}
                        config={config}
                        onSelectVariation={handleSelectVariation}
                        selectedMaterial={selectedMaterial}
                        selectedShape={selectedShape}
                        shapes={dbShapes}
                        onShapeChange={handleShapeChange}
                    />
                    <Button
                        className="exit-mode-button"
                        onClick={handleExitCustomise}
                    >
                        <img src={"cross.svg"} alt="exit-button" />
                    </Button>
                </div>
            )}

            <CartModal/>
            <Checkout/>
        </>
    );
}
