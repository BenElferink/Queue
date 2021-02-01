import styles from './styles/Timer.module.css';
import {
  Select,
  Input,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

export default function TimerModal({
  setTimer,
  setTimerModal,
  selectedMinutes,
  setSelectedMinutes,
}) {
  return (
    <Dialog open={true}>
      <DialogTitle>Set a reminder for your next interaction session.</DialogTitle>

      <DialogContent>
        <div className={styles.modal}>
          <div className={styles.modalForm}>
            <Select
              native
              input={<Input />}
              value={selectedMinutes}
              onChange={(e) => setSelectedMinutes(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
            </Select>
            <span>(minutes).</span>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button color='primary' onClick={() => setTimerModal(false)}>
          Cancel
        </Button>

        <Button
          color='primary'
          onClick={() => {
            Notification.requestPermission();
            if (Notification.permission === 'granted') {
              setTimer({ minutes: selectedMinutes, seconds: 0 });
              setTimerModal(false);
            } else {
              alert('You need to allow notifications to use this feature');
            }
          }}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
