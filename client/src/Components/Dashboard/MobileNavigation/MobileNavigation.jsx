import React from 'react';
import styles from './MobileNavigation.module.css';
import Button from '@material-ui/core/Button';
import HistoryIcon from '@material-ui/icons/History';
import HelpIcon from '@material-ui/icons/Help';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';

function MobileNavigation() {
  return (
    <div className={styles.component}>
      <Button className={styles.navButton}>
        <h1>Queue</h1>
      </Button>
      <Button className={styles.navButton}>
        <h1>Ask</h1>
      </Button>
      <Button className={styles.navButton}>
        <h1>History</h1>
      </Button>
    </div>
  );
}

export default MobileNavigation;
