import styles from './styles/Timer.module.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export default function TimerAlert({ closeThis }) {
  new Notification('Reminder from Queue', {
    body: 'Time to answer some questions',
  });

  const vertical = 'top';
  const horizontal = 'center';

  return (
    <Snackbar open={true} anchorOrigin={{ vertical, horizontal }} className={styles.alert}>
      <MuiAlert severity='warning' variant='filled' elevation={6} onClose={closeThis}>
        Time to clear the Queue!
      </MuiAlert>
    </Snackbar>
  );
}
