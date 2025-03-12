import React from 'react';

export default function PreviewSection({ onCustomise }) {

    return (
            <div className="preview-section wrapper">
                <h2>ZZZZZZZ</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, architecto autem cumque debitis
                    dignissimos distinctio dolores esse est ex, labore libero nisi perferendis quae sunt, suscipit ullam
                    veritatis! Ad animi aspernatur beatae delectus dignissimos dolor doloremque ea esse et id illo iste
                    mollitia necessitatibus nemo quasi quis sed, ullam, voluptatem.</p>
                <button className="button" onClick={onCustomise}>Customise!</button>
            </div>
    )
}
