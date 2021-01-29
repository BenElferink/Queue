import { Fragment, useEffect, useState } from 'react';
import { Howl, Howler } from 'howler';
import styles from './TimerAlert.module.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => <MuiAlert elevation={6} variant='filled' {...props} />;

export default function TimerAlert({ showTimerAlert, closeThis }) {
  const [state, setState] = useState({
    vertical: 'top',
    horizontal: 'center',
  });

  // const popUpNotify = () => {
  //   // const popUp = new Audio(
  //   //   'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3',
  //   // );
  //   // popUp.play();

  //   Howler.autoUnlock = true;

  //   const sound = new Howl({
  //     src: 'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3',
  //   });
  //   sound.play();
  // };

  const showNotification = () => {
    const notification = new Notification('Reminder from Queue', {
      body: 'Time to answer some questions',
    });

    return notification;
  };

  useEffect(() => {
    showNotification();
  }, [showTimerAlert]);

  const { vertical, horizontal } = state;

  return (
    <Fragment>
      <Snackbar
        className={styles.component}
        open={showTimerAlert}
        onClose={closeThis}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}>
        <Alert onClose={closeThis} severity='warning'>
          Time to clear the Queue!
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
