import React, {useEffect} from 'react';
import Button from "./UI/Button.jsx"
import "../index.css"
import { useState } from "react";

//TODO: make the sections more compact by letting them be created dynamically in one component with {...props} spreads

export default function Jumbotron() {


    // const [isScrolling, setIsScrolling] = useState(false);
    //
    // useEffect(() => {
    //     let timeoutId;
    //     const handleScroll = () => {
    //         // When the user scrolls, set isScrolling to true
    //         setIsScrolling(true);
    //
    //         // Clear any existing timeout
    //         clearTimeout(timeoutId);
    //
    //         // Set a timeout to mark scrolling as stopped after 150ms
    //         timeoutId = setTimeout(() => {
    //             setIsScrolling(false);
    //         }, 400);
    //     };
    //
    //     window.addEventListener('scroll', handleScroll);
    //
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //         clearTimeout(timeoutId);
    //     };
    // }, []);


    const handleStartNow = () => {
        const element = document.querySelector('.pitch-section');

        window.scrollTo({
            top: element?.getBoundingClientRect().top,
            left: 0,
            behaviour: "smooth"
        });
    }



    return (
        <>
            <div id="view1" className="jumbotron-section wrapper row m-0">
                <div className="jumbo-content paper-card col-6 align-content-top text-start ">
                    <h2 className="title-gold jumbo-title col-12 fs-1 ">ELEVATE YOUR GAME</h2>
                    <span className="description embossed-text">
                     <p> Our luxury dice combine cutting-edge materials with precision engineering for a perfectly balanced roll and a unique look.
                     </p>
                 </span>
                    <hr className="line w-50 embossed-text"/>
                    <Button onClick={handleStartNow}>SCROLL DOWN</Button>
                </div>

                {/*{!isScrolling && (*/}
                {/*    <div className="scroll-down-overlay">*/}
                {/*        <p>Scroll Down</p>*/}
                {/*        <p> &#x2193; </p>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </>
    )
}