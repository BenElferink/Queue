import { useEffect, useState } from 'react';
import styles from './TimerModal.module.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';

export default function TimerModal({ showTimer, setShowTimer, setTimer }) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');

  const handleChange = (event) => {
    setTime(Number(event.target.value) || '');
  };
  const handleClose = () => {
    setOpen(false);
    setShowTimer(false);
  };

  const setConfirm = () => {
    setTimer({ minutes: time, seconds: 0 });
    setOpen(false);
    setShowTimer(false);
  };

  useEffect(() => {
    setOpen(showTimer);
  }, [showTimer]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set a duration for your next interaction session.</DialogTitle>
        <DialogContent>
          <div className={styles.container}>
            <div className={styles.formControl}>
              <Select
                native
                value={time}
                onChange={handleChange}
                input={<Input id='timer_duration' />}>
                <option aria-label='None' value='' />
                <option value={5}>Five</option>
                <option value={10}>Ten</option>
                <option value={20}>Twenty</option>
                <option value={30}>Thirty</option>
              </Select>
              <span>(minutes).</span>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={setConfirm} color='primary'>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
