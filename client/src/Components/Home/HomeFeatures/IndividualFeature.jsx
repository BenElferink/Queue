import React from 'react'
import './IndividualFeature.css'

function IndividualFeature({imgSrc, featureName}) {
    return (
        <div className="IndividualFeatures">
            <img src={imgSrc} className="IndividualFeatures__image" alt=""/>
            <h5>{featureName}</h5>
        </div>
    )
}

export default IndividualFeature
