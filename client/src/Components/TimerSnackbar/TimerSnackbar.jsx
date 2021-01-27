import {Fragment, useState} from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import styles from './TimerSnackbar.module.css'

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

export default function TimerSnackbar({ snack, setSnack }) {
  const handleClose = (event, reason) => setSnack(false)
  const [state, setState] = useState({
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal } = state;

  return (
    <Fragment>
      <Snackbar className={styles.component} open={snack} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
        <Alert onClose={handleClose} severity='warning'>
          Time to clear the Queue!
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
