import React from 'react'
import { NavHashLink  } from 'react-router-hash-link';
import { IconButton, Tooltip } from '@material-ui/core';


function NavbarIcon({link,title,icon}) {
    return (
        <div>
            <NavHashLink smooth to={link}>
                <Tooltip position="bottom-end" title={title}>
                    <IconButton>
                        {icon}
                    </IconButton> 
                </Tooltip>
            </NavHashLink>
        </div>
    )
}

export default NavbarIcon
