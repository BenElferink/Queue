import React from 'react'
import ScriptTag from 'react-script-tag';

function ScriptTagComponent() {
    return (
        <ScriptTag isHydrating={true} type="text/javascript" src="https://donorbox.org/widget.js" paypalExpress="false"/>
        // <ScriptTag isHydrating={true} type="text/javascript" defer src="https://donorbox.org/install-popup-button.js"/>
        
        )
}

export default ScriptTagComponent
