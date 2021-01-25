import React, { useState } from 'react'
import './Navbar.css'
import blackQueueLogo from './../../images/blackQueueLogo.svg'
import HomeIcon from '@material-ui/icons/Home';
import { Slide } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import BugReportIcon from '@material-ui/icons/BugReport';
import NavbarIcon from './NavbarIcon';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TimerIcon from '@material-ui/icons/Timer';

function Navbar() {
    const [navbar,setNavbar] = useState(false)
    const [userAuth,setUserAuth] = useState(false) //set true to enable user Navbar options
    const [hostAuth,setHostAuth] = useState(false) //set true to enable host Navbar options

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

    /*
    if(session_role === "user"){
        setUserAuth(true);
    }
    else if(session_role === "host"){
        setHostAuth(true);
    }
    else{
        setUserAuth(false);
        setHostAuth(false);
    }
    */

    return (
        <div className={`navbar ${navbar && "active"}`}>
            <div className="navbar__left">
                <img src={blackQueueLogo} className="navbar__logo" alt="Queue Logo"/>
            </div>
            <Slide in={true} direction={"left"} timeout={500}>
                <div className={`navbar__right ${(userAuth | hostAuth) && "navbar__right--hide"}`}>
                    <NavbarIcon link={"/#home"} title="Home" icon={<HomeIcon/>}/>
                    <NavbarIcon link={"#aboutQueue"} title="About Us" icon={<InfoIcon/>}/>
                    <NavbarIcon link={"#Support_the_Application"} title="Donate" icon={<MonetizationOnIcon/>}/>
                    <NavbarIcon link={"#ContactInfo"} title="Report Bug" icon={<BugReportIcon/>}/>
                </div>
            </Slide>
            <Slide in={true} direction={"left"} timeout={500}>
                <div className={`navbar__user ${userAuth && "navbar__user--show"}`}>
                    <NavbarIcon link={"/#home"} title="Leave Session" icon={<ExitToAppIcon/>}/>
                </div>
            </Slide>
            <Slide in={true} direction={"left"} timeout={500}>
                <div className={`navbar__host ${hostAuth && "navbar__host--show"}`}>
                    <NavbarIcon link={"/#home"} title="Set Timer for Doubts" icon={<TimerIcon/>}/>
                    <NavbarIcon link={"/#home"} title="Invite to Session" icon={<PersonAddIcon/>}/>
                    <NavbarIcon link={"/#home"} title="Leave Session" icon={<ExitToAppIcon/>}/>
                </div>
            </Slide>
        </div>
    )
}

export default Navbar
