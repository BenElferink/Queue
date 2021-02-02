import styles from './Navbar.module.css';
import { NavHashLink } from 'react-router-hash-link';
import { Slide, IconButton, Tooltip } from '@material-ui/core';

export function IconWrapper({ children, glassMorph }) {
  return (
    <Slide in={true} direction={'left'} timeout={1200}>
      <div className={`${styles.icons} ${glassMorph && styles.glass}`}>{children}</div>
    </Slide>
  );
}

export function Icon({ link, title, icon, onClick }) {
  return (
    <NavHashLink smooth to={link ? link : ''}>
      <Tooltip title={title} position='bottom' enterDelay={300}>
        <IconButton onClick={onClick} children={icon} />
      </Tooltip>
    </NavHashLink>
  );
}
