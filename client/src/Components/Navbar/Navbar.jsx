import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import blackQueueLogo from './../../images/blackQueueLogo.svg';
import { IconWrapper, Icon } from './NavbarIcon';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import TimerIcon from '@material-ui/icons/Timer';
import BugReportIcon from '@material-ui/icons/BugReport';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

export default function Navbar() {
  const [navbar, setNavbar] = useState(false);
  const [userAuth, setUserAuth] = useState(false); //set true to enable user Navbar options
  const [hostAuth, setHostAuth] = useState(false); //set true to enable host Navbar options

  useEffect(() => {
    const addNavShadow = () => {
      // if scrolling passed 80px from the top
      if (window.scrollY >= 80) {
        setNavbar(true);
      } else {
        setNavbar(false);
      }
    };

    window.addEventListener('scroll', addNavShadow);
    return () => {
      window.removeEventListener('scroll', addNavShadow);
    };
  }, []);

  // if (session_role === 'user') {
  //   setUserAuth(true);
  // } else if (session_role === 'host') {
  //   setHostAuth(true);
  // } else {
  //   setUserAuth(false);
  //   setHostAuth(false);
  // }

  return (
    <div className={`${styles.component} ${navbar && styles.sticky}`}>
      <img src={blackQueueLogo} className={styles.logo} alt='Queue' />

      {/* Nav-icons for the homepage */}
      {!userAuth && !hostAuth && (
        <IconWrapper>
          <Icon link={'/#home'} title='Home' icon={<HomeIcon />} />
          <Icon link={'#aboutQueue'} title='About Us' icon={<InfoIcon />} />
          <Icon link={'#Support_the_Application'} title='Donate' icon={<MonetizationOnIcon />} />
          <Icon link={'#ContactInfo'} title='Report Bug' icon={<BugReportIcon />} />
        </IconWrapper>
      )}

      {/* Nav-icons for the user dashboard */}
      {userAuth && (
        <IconWrapper>
          <Icon link={'/#home'} title='Leave Session' icon={<ExitToAppIcon />} />
        </IconWrapper>
      )}

      {/* Nav-icons for the host dashboard */}
      {hostAuth && (
        <IconWrapper>
          <Icon link={'/#home'} title='Set Timer for Doubts' icon={<TimerIcon />} />
          <Icon link={'/#home'} title='Invite to Session' icon={<PersonAddIcon />} />
          <Icon link={'/#home'} title='Leave Session' icon={<ExitToAppIcon />} />
        </IconWrapper>
      )}
    </div>
  );
}
