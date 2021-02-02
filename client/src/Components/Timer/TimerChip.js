import { useEffect } from 'react';
import styles from './styles/Timer.module.css';
import { Chip } from '@material-ui/core';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import RestoreRoundedIcon from '@material-ui/icons/RestoreRounded';

export default function TimerChip({ timer, setTimer, selectedMinutes }) {
  useEffect(() => {
    let seconds = Number(timer.seconds);
    let minutes = Number(timer.minutes);

    const interval = setInterval(() => {
      if (seconds !== 0) {
        setTimer({ minutes: minutes, seconds: seconds - 1 });
      } else if (minutes !== 0 && seconds === 0) {
        setTimer({ minutes: minutes - 1, seconds: 59 });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const timeToString = (timer) => {
    let minutes = Number(timer.minutes);
    let seconds = Number(timer.seconds);
    minutes < 10 ? (minutes = `0${minutes}`) : (minutes = `${minutes}`);
    seconds < 10 ? (seconds = `0${seconds}`) : (seconds = `${seconds}`);
    return `${minutes}:${seconds}`;
  };

  return (
    <Chip
      className={styles.chip}
      avatar={<AccessAlarmIcon />}
      label={timeToString(timer)}
      onDelete={() => setTimer({ minutes: selectedMinutes, seconds: 0 })}
      deleteIcon={<RestoreRoundedIcon />}
    />
  );
}
