import { Fragment, useContext, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../app/actions';
import { SocketContext } from './../../app/SocketContext';
import styles from './styles/Navbar.module.css';
import queueLogoBlack from './images/queue-logo-black.svg';
import TimerChip from '../Timer/TimerChip';
import TimerModal from '../Timer/TimerModal';
import DownloadPDF from '../DownloadPDF/DownloadPDF';
import { IconWrapper, Icon } from './NavItems';
import { Chip } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import TimerIcon from '@material-ui/icons/Timer';
import BugReportIcon from '@material-ui/icons/BugReport';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

const Emoji = () => <div className={styles.welcomeIcon}>🔑</div>;

export default function Navbar({ toggleShowSessionUrl, triggerAlert }) {
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);
  const { role, username, token } = useSelector((state) => state.authReducer);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
  const onMountRef = useRef(true);

  useEffect(() => {
    // if scrolling passed 80px from the top
    const addNavShadow = () => (window.scrollY >= 80 ? setIsScrolled(true) : setIsScrolled(false));
    window.addEventListener('scroll', addNavShadow);
    return () => {
      window.removeEventListener('scroll', addNavShadow);
    };
  }, []);

  const logout = () => {
    socket.disconnect();
    dispatch(logoutAction());
    // alert('You have been logged out.');
  };

  const handleUserLogout = () => {
    if (window.confirm('Are you sure you want to leave this session?')) logout();
  };

  const handleHostLogout = () => {
    if (window.confirm('Are you sure you want to end this session? All users will be logged out.'))
      socket.emit('delete-room', { token }, (error) => error && console.log(error));
  };

  useEffect(() => {
    socket.on('deleted-room', logout);
    return () => socket.off('deleted-room', logout);
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    if (!onMountRef.current && timer.minutes === 0 && timer.seconds === 0) {
      triggerAlert();
      onMountRef.current = true;
    }
    if (onMountRef) onMountRef.current = false;
    // eslint-disable-next-line
  }, [timer.minutes, timer.seconds]);

  return (
    <div
      className={`${styles.component} ${isScrolled && styles.navColor} ${
        role !== null && styles.glassMorph
      }`}>
      <img src={queueLogoBlack} className={styles.logo} alt='Queue' />

      {/* Nav-icons for the homepage */}
      {role === null && (
        <IconWrapper glassMorph={false}>
          <Icon link={'/#home'} title='Home' icon={<HomeIcon />} />
          <Icon link={'#aboutQueue'} title='About us' icon={<InfoIcon />} />
          <Icon link={'#Support_the_Application'} title='Donate' icon={<MonetizationOnIcon />} />
          <Icon link={'#ContactInfo'} title='Report a bug' icon={<BugReportIcon />} />
        </IconWrapper>
      )}

      {/* Nav-icons for the user dashboard */}
      {role === 'user' && (
        <IconWrapper glassMorph={true}>
          <Chip icon={<Emoji />} className={styles.welcomeChip} label={username} color='primary' />
          <DownloadPDF />
          <Icon onClick={handleUserLogout} title='Leave session' icon={<ExitToAppIcon />} />
        </IconWrapper>
      )}

      {/* Nav-icons for the host dashboard */}
      {role === 'host' && (
        <Fragment>
          <TimerChip timer={timer} setTimer={setTimer} selectedMinutes={selectedMinutes} />

          <IconWrapper glassMorph={true}>
            <Icon
              title='Invite to session'
              icon={<PersonAddIcon />}
              onClick={toggleShowSessionUrl}
            />
            <Icon
              title='Set Q&A Timer'
              icon={<TimerIcon />}
              onClick={() => setShowTimerModal(true)}
            />
            <DownloadPDF />
            <Icon onClick={handleHostLogout} title='Delete session' icon={<ExitToAppIcon />} />
          </IconWrapper>
        </Fragment>
      )}
      {showTimerModal && (
        <TimerModal
          setTimer={setTimer}
          setTimerModal={setShowTimerModal}
          selectedMinutes={selectedMinutes}
          setSelectedMinutes={setSelectedMinutes}
        />
      )}
    </div>
  );
}
