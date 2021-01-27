import { Fragment, useEffect } from 'react';

function Counter({ timer, setTimer }) {
  useEffect(() => {
    let seconds = Number(timer.seconds);
    let minutes = Number(timer.minutes)
    const interval = setInterval(() => {
      if(seconds !== 0 && minutes !== 0){
        setTimer({ minutes: minutes, seconds: seconds - 1 });
      } else if(seconds === 0 && minutes !== 0){
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

  return <Fragment>{timeToString(timer)}</Fragment>;
}

export default Counter;
