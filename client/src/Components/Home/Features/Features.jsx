import styles from './Features.module.css';
import { Container, Row, Column } from './Bootstrap';
import HistoryFeature from './../../../images/HistoryFeature.svg';
import voiceText from './../../../images/voiceText.svg';
import timeQueue from './../../../images/timeQueue.svg';
import timerDoubt from './../../../images/timerDoubt.svg';
import oneClick from './../../../images/oneClick.svg';

export default function HomeFeatures() {
  return (
    <div className={styles.component}>
      <h1>Features</h1>

      <Container>
        <Row>
          <Column size='md-4'>
            <div className={styles.item}>
              <img className={styles.image} src={HistoryFeature} alt='icon' />
              <h5 className={styles.info}>History Record of Answered Questions</h5>
            </div>
          </Column>
          <Column size='md-4'>
            <div className={styles.item}>
              <img className={styles.image} src={voiceText} alt='icon' />
              <h5 className={styles.info}>Voice to Text Conversion of Answers</h5>
            </div>
          </Column>
          <Column size='md-4'>
            <div className={styles.item}>
              <img className={styles.image} src={timeQueue} alt='icon' />
              <h5 className={styles.info}>Timestamp Based Questions Queue</h5>
            </div>
          </Column>
        </Row>
        <Row>
          <Column size='md-6'>
            <div className={styles.item}>
              <img className={styles.image} src={timerDoubt} alt='icon' />
              <h5 className={styles.info}>Set Timer for Doubt Clearance Session</h5>
            </div>
          </Column>
          <Column size='md-6'>
            <div className={styles.item}>
              <img className={styles.image} src={oneClick} alt='icon' />
              <h5 className={styles.info}>One Click Session Commencement</h5>
            </div>
          </Column>
        </Row>
      </Container>
    </div>
  );
}
