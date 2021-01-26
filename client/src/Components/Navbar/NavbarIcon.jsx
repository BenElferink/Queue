import { NavHashLink } from 'react-router-hash-link';
import styles from './Navbar.module.css';
import { Slide, IconButton, Tooltip } from '@material-ui/core';

export function IconWrapper({ children, glassMorph }) {
  return (
    <Slide in={true} direction={'left'} timeout={800}>
      <div className={`${styles.icons} ${glassMorph && styles.glass}`}>{children}</div>
    </Slide>
  );
}

export function Icon({ link, title, icon, onClick }) {
  return (
    <NavHashLink smooth to={link ? link : ''}>
      <Tooltip position='bottom' title={title}>
        <IconButton onClick={onClick}>{icon}</IconButton>
      </Tooltip>
    </NavHashLink>
  );
}
