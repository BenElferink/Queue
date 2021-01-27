import { Fragment, useContext, useEffect, useState, useRef } from 'react';
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
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TimerModal from './TimerModal/TimerModal';
import Counter from './TimerModal/Counter';
import { deleteSession } from '../../api';

const Emoji = () => <div className={styles.welcomeIcon}>🔑</div>;

export default function Navbar({ toggleShowSessionUrl, setSnack }) {
  const { logoutToken, token } = useContext(TokenContext);
  const { logoutSession } = useContext(SessionContext);
  const { logoutLogged, logged } = useContext(LoggedContext);

  const [isScrolled, setIsScrolled] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(10)
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
  const onMountRef = useRef(true)

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

  const handleUserLogout = () => {
    logoutToken();
    logoutSession();
    logoutLogged();
  };

  const handleHostLogout = async () => {
    const response = await deleteSession(token);
    if (response) {
      handleUserLogout();
    }
  };

  useEffect(() => {
    if(!onMountRef.current && timer.minutes === 0 && timer.seconds === 0){
      setSnack(true)
      onMountRef.current = true
    }

    if(onMountRef) onMountRef.current = false
  }, [timer.minutes, timer.seconds])

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
          <Icon link={'#aboutQueue'} title='About us' icon={<InfoIcon />} />
          <Icon link={'#Support_the_Application'} title='Donate' icon={<MonetizationOnIcon />} />
          <Icon link={'#ContactInfo'} title='Report a bug' icon={<BugReportIcon />} />
        </IconWrapper>
      )}

      {/* Nav-icons for the user dashboard */}
      {logged.role === 'user' && (
        <IconWrapper glassMorph={true}>
          <Chip
            icon={<Emoji />}
            className={styles.welcomeChip}
            label={logged.username}
            color='primary'
          />
          <Icon onClick={handleUserLogout} title='Leave session' icon={<ExitToAppIcon />} />
        </IconWrapper>
      )}

      {showTimerModal ? (
        <TimerModal selectedMinutes={selectedMinutes} setSelectedMinutes={setSelectedMinutes} setTimer={setTimer} setShowTimerModal={setShowTimerModal}  />
      ) : null}
      {/* Nav-icons for the host dashboard */}
      {logged.role === 'host' && (
        <Fragment>
          <Chip
            icon={<AccessAlarmIcon />}
            className={styles.timerChip}
            label={<Counter timer={timer} setTimer={setTimer}/>}
          />

          <IconWrapper glassMorph={true}>
            <Icon title='Set Q&A Timer' icon={<TimerIcon />} onClick={() => setShowTimerModal(true)} />
            <Icon
              title='Invite to session'
              icon={<PersonAddIcon />}
              onClick={toggleShowSessionUrl}
            />
            <Icon onClick={handleHostLogout} title='Delete session' icon={<ExitToAppIcon />} />
          </IconWrapper>
        </Fragment>
      )}
    </div>
  );
}
