import { Fragment, useEffect } from 'react';

function Counter({ timer, setTimer }) {
  useEffect(() => {
    let num = Number(timer.seconds);
    const interval = setInterval(() => {
      if (num < 1) {
        setTimer({ minutes: Number(timer.minutes) - 1, seconds: Number(59) });
      } else {
        setTimer({ minutes: Number(timer.minutes), seconds: num - 1 });
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
    return `00:${minutes}:${seconds}`;
  };

  return <Fragment>Next Interaction in {timeToString(timer)} minutes</Fragment>;
}

export default Counter;
