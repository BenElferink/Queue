import { Fragment, useContext, useEffect, useState } from 'react';
import { TokenContext } from '../../contexts/TokenContext';
import { SessionContext } from '../../contexts/SessionContext';
import { LoggedContext } from '../../contexts/LoggedContext';
import styles from './Navbar.module.css';
import blackQueueLogo from './../../images/blackQueueLogo.svg';
import { IconWrapper, Icon } from './NavbarIcon';
import { Chip } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import TimerIcon from '@material-ui/icons/Timer';
import BugReportIcon from '@material-ui/icons/BugReport';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

const Emoji = () => <div className={styles.welcomeIcon}>👋🏼</div>;

export default function Navbar() {
  const { logoutToken } = useContext(TokenContext);
  const { logoutSession } = useContext(SessionContext);
  const { logoutLogged, logged } = useContext(LoggedContext);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const addNavShadow = () => {
      // if scrolling passed 80px from the top
      if (window.scrollY >= 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', addNavShadow);
    return () => {
      window.removeEventListener('scroll', addNavShadow);
    };
  }, []);

  const handleLogout = () => {
    logoutToken();
    logoutSession();
    logoutLogged();
  };

  return (
    <div
      className={`${styles.component} ${isScrolled && styles.navColor} ${
        logged.role !== null && styles.glassMorph
      }`}>
      <img src={blackQueueLogo} className={styles.logo} alt='Queue' />

      {/* Nav-icons for the homepage */}
      {logged.role === null && (
        <IconWrapper glassMorph={false}>
          <Icon link={'/#home'} title='Home' icon={<HomeIcon />} />
          <Icon link={'#aboutQueue'} title='About Us' icon={<InfoIcon />} />
          <Icon link={'#Support_the_Application'} title='Donate' icon={<MonetizationOnIcon />} />
          <Icon link={'#ContactInfo'} title='Report Bug' icon={<BugReportIcon />} />
        </IconWrapper>
      )}

      {/* Nav-icons for the user dashboard */}
      {logged.role === 'user' && (
        <IconWrapper glassMorph={true}>
          {/* <div className={styles.right}> */}
          <Chip
            icon={<Emoji />}
            className={styles.welcome}
            label={logged.username}
            color='secondary'
          />
          {/* </div> */}
          <Icon onClick={handleLogout} title='Leave Session' icon={<ExitToAppIcon />} />
        </IconWrapper>
      )}

      {/* Nav-icons for the host dashboard */}
      {logged.role === 'host' && (
        <IconWrapper glassMorph={true}>
          <Icon link={'/#home'} title='Set Timer for Doubts' icon={<TimerIcon />} />
          <Icon link={'/#home'} title='Invite to Session' icon={<PersonAddIcon />} />
          <Icon link={'/#home'} title='Leave Session' icon={<ExitToAppIcon />} />
        </IconWrapper>
      )}
    </div>
  );
}
