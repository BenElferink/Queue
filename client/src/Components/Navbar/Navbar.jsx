import { Fragment, useContext, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../app/actions';
import { SocketContext } from './../../app/SocketContext';
import { jsPDF } from 'jspdf';
import styles from './Navbar.module.css';
import blackQueueLogo from './../../images/blackQueueLogo.svg';
import Counter from './TimerModal/Counter';
import TimerModal from './TimerModal/TimerModal';
import { IconWrapper, Icon } from './NavbarIcon';
import { Chip } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import TimerIcon from '@material-ui/icons/Timer';
import RestoreRoundedIcon from '@material-ui/icons/RestoreRounded';
import BugReportIcon from '@material-ui/icons/BugReport';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import GetAppIcon from '@material-ui/icons/GetApp';

const Emoji = () => <div className={styles.welcomeIcon}>🔑</div>;

export default function Navbar({ toggleShowSessionUrl, triggerAlert }) {
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);
  const { history } = useSelector((state) => state.roomReducer);
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

  const downloadPDF = () => {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();

    let historyData = [];
    for (let i = 0; i < history.length; i++) {
      historyData.unshift('');
      historyData.unshift(` At: ${new Date(history[i].updatedAt).toTimeString()}`);
      // historyData.unshift('At:');
      historyData.unshift(` Answer: ${history[i].answer}`);
      // historyData.unshift('Answer:');
      historyData.unshift(` Question: ${history[i].question}`);
      // historyData.unshift('Question:');
    }

    const printData = doc.splitTextToSize(historyData, 120);
    doc.setFontSize(12);
    // doc.advancedAPI((doc) => {
    //   doc.setFont('Rubik.ttf', 'Rubik-VariableFont_wght', 'normal');
    // });

    let y = 15;
    for (let i = 0; i < printData.length; i++) {
      if (y > 280) {
        y = 10;
        doc.addPage();
      }
      doc.text(15, y, printData[i]);
      y = y + 7;
    }

    // doc.text(printData, 10, 20);
    doc.save(`Queue ${new Date()}.pdf`);
  };

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
      <img src={blackQueueLogo} className={styles.logo} alt='Queue' />

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
          <Icon onClick={downloadPDF} icon={<GetAppIcon />} title='Download History' />
          <Icon onClick={handleUserLogout} title='Leave session' icon={<ExitToAppIcon />} />
        </IconWrapper>
      )}

      {/* Nav-icons for the host dashboard */}
      {role === 'host' && (
        <Fragment>
          <Chip
            className={styles.timerChip}
            avatar={<AccessAlarmIcon />}
            label={<Counter timer={timer} setTimer={setTimer} />}
            onDelete={() => setTimer({ minutes: selectedMinutes, seconds: 0 })}
            deleteIcon={<RestoreRoundedIcon />}
          />

          <IconWrapper glassMorph={true}>
            <Icon
              title='Set Q&A Timer'
              icon={<TimerIcon />}
              onClick={() => setShowTimerModal(true)}
            />
            <Icon
              title='Invite to session'
              icon={<PersonAddIcon />}
              onClick={toggleShowSessionUrl}
            />
            <Icon onClick={handleHostLogout} title='Delete session' icon={<ExitToAppIcon />} />
          </IconWrapper>
        </Fragment>
      )}
      {showTimerModal && (
        <TimerModal
          selectedMinutes={selectedMinutes}
          setSelectedMinutes={setSelectedMinutes}
          setTimer={setTimer}
          setShowTimerModal={setShowTimerModal}
        />
      )}
    </div>
  );
}
