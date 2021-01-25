import { NavHashLink } from 'react-router-hash-link';
import styles from './Navbar.module.css';
import { Slide, IconButton, Tooltip } from '@material-ui/core';

export function IconWrapper({ children, glassMorph }) {
  return (
    <Slide in={true} direction={'left'} timeout={500}>
      <div className={`${styles.icons} ${glassMorph && styles.glass}`}>{children}</div>
    </Slide>
  );
}

export function Icon({ link, title, icon }) {
  return (
    <NavHashLink smooth to={link}>
      <Tooltip position='bottom' title={title}>
        <IconButton>{icon}</IconButton>
      </Tooltip>
    </NavHashLink>
  );
}
