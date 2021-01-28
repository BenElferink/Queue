import { Fragment, useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import styles from './TimerSnackbar.module.css';
import { Howl, Howler } from 'howler';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

export default function TimerSnackbar({ snack, setSnack }) {
  const handleClose = (event, reason) => setSnack(false);
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
    const notification = new Notification("Reminder from Queue",{
      body: "Time to answer some questions"
    })

    return notification;
  }

  useEffect(() => {
    showNotification();
  }, [snack]);

  const { vertical, horizontal } = state;

  return (
    <Fragment>
      <Snackbar
        className={styles.component}
        open={snack}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}>
        <Alert onClose={handleClose} severity='warning'>
          Time to clear the Queue!
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
