import React from 'react';

//TODO: make the sections more compact by letting them be created dynamically in one component with {...props} spreads

export default function Jumbotron() {

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
            <div id="view1" className="jumbotron-section wrapper">
                <h2>ELEVATE YOUR GAME</h2>
                <span className="description">
                     <p> Our luxury dice combine cutting-edge materials with precision engineering for a truly exquisite feel
                     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, architecto autem cumque debitis
                    dignissimos distinctio dolores esse est ex, labore libero nisi perferendis quae sunt, suscipit ullam
                    veritatis! Ad animi aspernatur beatae delectus dignissimos dolor doloremque ea esse et id illo iste
                    mollitia necessitatibus nemo quasi quis sed, ullam, voluptatem</p>
                 </span>
                <button onClick={handleStartNow}>START NOW</button>
            </div>
        </>
    )
}