import React, { useEffect } from 'react';
import styles from './MobileNavigation.module.css';
import Button from '@material-ui/core/Button';
import HistoryIcon from '@material-ui/icons/History';
import HelpIcon from '@material-ui/icons/Help';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import Slide from '@material-ui/core/Slide';

export default function MobileNavigation({ setMobileNav, isHost }) {
  useEffect(() => {
    setMobileNav({ section1: true, section2: false, section3: false });
    // eslint-disable-next-line
  }, []);

  return (
    <Slide in={true} direction={'up'}>
      <div className={styles.component}>
        <Button onClick={() => setMobileNav({ section1: true, section2: false, section3: false })}>
          <HelpIcon />
          <h5>Queue</h5>
        </Button>
        <Button onClick={() => setMobileNav({ section1: false, section2: true, section3: false })}>
          <QuestionAnswerIcon />
          <h5>{isHost? "Answer" : "Ask"}</h5>
        </Button>
        <Button onClick={() => setMobileNav({ section1: false, section2: false, section3: true })}>
          <HistoryIcon />
          <h5>History</h5>
        </Button>
      </div>
    </Slide>
  );
}
