import { Button } from '@material-ui/core'
import React from 'react'
import './Donate.css'

function Donate() {
    return (
        <div className="donate container">
            <div className="row">
                <div className="col-md-12 donate__heading">
                    <h1>Liked our <span>App</span>?</h1>
                    <br />
                    <span>“It's not how much we give but how much love we put into giving.”
                    ― Mother Theresa</span>
                    <br />
                    <p>Hey there User! This application might not be the best of what is possible. There might be far more things that can be improved. But we've made this out of nothing. So imagine if we had a good funding!</p>
                    <Button size="large" variant="outlined">Donate Now</Button>
                </div>
            </div>
        </div>
    )
}

export default Donate
