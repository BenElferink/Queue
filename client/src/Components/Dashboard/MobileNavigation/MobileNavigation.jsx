import React from 'react';
import styles from './MobileNavigation.module.css';
import Button from '@material-ui/core/Button';
import HistoryIcon from '@material-ui/icons/History';
import HelpIcon from '@material-ui/icons/Help';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';

function MobileNavigation() {
  return (
    <div className={styles.component}>
      <Button>
        <HelpIcon />
        <h5>Queue</h5>
      </Button>
      <Button>
        <QuestionAnswerIcon />
        <h5>Ask</h5>
      </Button>
      <Button>
        <HistoryIcon />
        <h5>History</h5>
      </Button>
    </div>
  );
}

export default MobileNavigation;
