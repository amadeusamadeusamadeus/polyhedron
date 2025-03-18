import React from 'react';

export default function PreviewSection({onCustomise}) {

    return (
        <div className="preview-section wrapper row">
            <div className="preview-content paper-card col-6 offset-3 justify-content-center text-center">
                <h2 className="title-gold">CUSTOMIZE YOUR DICE</h2>
                <p>You can customize both the material and the shape of your dice. Zoom and rotate to look at it from
                    every angle and add it to your personal cart!</p>
                <hr className="line w-50 mx-auto"/>
                <button className="button" onClick={onCustomise}>CUSTOMIZE</button>
            </div>
        </div>
    )
}
