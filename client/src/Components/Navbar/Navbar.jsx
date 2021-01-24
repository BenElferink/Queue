import React, { useState } from 'react'
import './Navbar.css'
import blackQueueLogo from './../../images/blackQueueLogo.svg'

function Navbar() {
    const [navbar,setNavbar] = useState(false)

    const addNavShadow = () =>{
        if(window.scrollY>=80){
            console.log(window.scrollY)
            setNavbar(true)
        }
        else{
            setNavbar(false)
        }
    }

    window.addEventListener('scroll',addNavShadow)

    return (
        <div className={`navbar ${navbar && "active"}`}>
            <div className="navbar__left">
                <img src={blackQueueLogo} className="navbar__logo" alt=""/>
            </div>
            <div className="navbar__right">
                
            </div>
        </div>
    )
}

export default Navbar
