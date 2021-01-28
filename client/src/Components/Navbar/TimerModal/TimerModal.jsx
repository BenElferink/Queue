import styles from './TimerModal.module.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';

export default function TimerModal({
  selectedMinutes,
  setSelectedMinutes,
  setTimer,
  setShowTimerModal,
}) {

  const clickConfirm = () => {
    setTimer({ minutes: selectedMinutes, seconds: 0 });
    if(window.Notification && Notification.permission === "granted"){
      setShowTimerModal(false);
    }else if(window.Notification && Notification.permission !== "denied"){
       Notification.requestPermission()
    }
  };


  const clickCancel = () => {
    setShowTimerModal(false);
  };

  const handleChange = (event) => {
    setSelectedMinutes(Number(event.target.value));
  };

  return (
    <Dialog open={true}>
      <DialogTitle>Set a duration for your next interaction session.</DialogTitle>
      <DialogContent>
        <div className={styles.container}>
          <div className={styles.formControl}>
            <Select
              native
              value={selectedMinutes}
              onChange={handleChange}
              input={<Input id='timer_duration' />}>
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
        <Button onClick={clickCancel} color='primary'>
          Cancel
        </Button>
        <Button onClick={clickConfirm} color='primary'>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
