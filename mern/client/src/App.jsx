import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header.jsx"
import WebgiViewer from "./components/WebGIViewer.jsx";
import {ViewerApp} from "https://dist.pixotronics.com/webgi/runtime/bundle-0.10.4.mjs";
import Jumbotron from "./components/Jumbotron.jsx";
import PitchSection from "./components/PitchSection.jsx";
import PreviewSection from "./components/PreviewSection.jsx";


function App() {

    return (
        <>
            <Header/>
            <div className="mt-0 my-1">
                <hr className="line"/>
            </div>
            <Jumbotron/>
            <WebgiViewer/>
            <PitchSection/>
            <PreviewSection/>
        </>
    )
}

export default App
