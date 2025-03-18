import React from 'react';

export default function PitchSection() {
    const handleExplore = () => {
        const element = document.querySelector('.preview-section');
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
            top: elementTop,
            left: 0,
            behavior: "smooth" // Note the correct spelling: "behavior"
        });
    };

    return (
        <div className="pitch-section wrapper row">
            <div className="pitch-content paper-card col-6 offset-6 align-content-top text-end">
                <h2 className="pitch-title title-silver">TRY IT BELOW</h2>
                <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, architecto autem cumque debitis
                    dignissimos distinctio dolores esse est ex, labore libero nisi perferendis quae sunt, suscipit ullam
                    veritatis! Ad animi aspernatur beatae delectus dignissimos dolor doloremque ea esse et id illo iste
                    mollitia necessitatibus nemo quasi quis sed, ullam, voluptatem</p>
                <hr className="line w-50 ms-auto"/>
                <button onClick={handleExplore}>SCROLL DOWN</button>
            </div>
        </div>


    )
}
