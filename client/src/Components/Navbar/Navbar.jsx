import React, { useState } from 'react'
import './Navbar.css'
import blackQueueLogo from './../../images/blackQueueLogo.svg'
import HomeIcon from '@material-ui/icons/Home';
import { IconButton, Slide, Tooltip } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import CodeIcon from '@material-ui/icons/Code';
import BugReportIcon from '@material-ui/icons/BugReport';
import { NavHashLink  } from 'react-router-hash-link';

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
            <Slide in={true} direction={"left"} timeout={500}>
                <div className="navbar__right">
                    <NavHashLink smooth to="/#home">
                        <Tooltip position="bottom-end" title="Home">
                            <IconButton>
                                <HomeIcon/>
                            </IconButton> 
                        </Tooltip>
                    </NavHashLink>
                    <NavHashLink smooth to="#aboutQueue">
                        <Tooltip position="bottom-end" title="About Us">
                            <IconButton>
                                <InfoIcon/>
                            </IconButton> 
                        </Tooltip>
                    </NavHashLink>
                    <NavHashLink smooth to="#DevelopersInfo">
                        <Tooltip position="bottom-end" title="Developer Info">
                            <IconButton>
                                <CodeIcon/>
                            </IconButton> 
                        </Tooltip>
                    </NavHashLink>
                    <NavHashLink smooth to="#ContactInfo">
                        <Tooltip position="bottom-end" title="Report Bug">
                            <IconButton>
                                <BugReportIcon/>
                            </IconButton> 
                        </Tooltip>
                    </NavHashLink>
                </div>
            </Slide>
        </div>
    )
}

export default Navbar
