import React from 'react';

export default function Jumbotron () {

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
             <div className="jumbotron-section wrapper">
                <h2>ELEVATE YOUR GAME</h2>
                 <span className="description">
                     <p> Our luxury dice combine cutting-edge materials with precision engineering for a truly exquisite feel</p>
                 </span>
                 <button onClick={handleStartNow}>START NOW</button>
             </div>
        </>)
}