import styles from './Features.module.css';
import { Container, Row, Column } from './Bootstrap';
import PdfFeature from './../../../images/PdfFeature.svg';
import voiceText from './../../../images/voiceText.svg';
import timeQueue from './../../../images/timeQueue.svg';
import timerDoubt from './../../../images/timerDoubt.svg';
import oneClick from './../../../images/oneClick.svg';
import privacy from './../../../images/privacy.svg';
import realtime from './../../../images/realtime.svg';

export default function Features() {
  return (
    <div className={styles.component}>
      <h1>Features</h1>

      <Container>
        <Row>
          <Column size_md='md-3'>
            <div className={styles.item}>
              <img className={styles.image} src={PdfFeature} alt='icon' />
              <h5 className={styles.info}>Download PDF of answered questions</h5>
            </div>
          </Column>
          <Column size_md='md-3'>
            <div className={styles.item}>
              <img className={styles.image} src={voiceText} alt='icon' />
              <h5 className={styles.info}>Voice to text conversion of answers</h5>
            </div>
          </Column>
          <Column size_md='md-3'>
            <div className={styles.item}>
              <img className={styles.image} src={timeQueue} alt='icon' />
              <h5 className={styles.info}>Timestamp based questions queue</h5>
            </div>
          </Column>
          <Column size_md='md-3'>
            <div className={styles.item}>
              <img className={styles.image} src={timerDoubt} alt='icon' />
              <h5 className={styles.info}>Set timer for doubt clearance session</h5>
            </div>
          </Column>
        </Row>
        <Row>
          <Column size_md='md-4'>
            <div className={styles.item}>
              <img className={styles.image} src={privacy} alt='icon' />
              <h5 className={styles.info}>Privacy and Security</h5>
            </div>
          </Column>
          <Column size_md='md-4'>
            <div className={styles.item}>
              <img className={styles.image} src={oneClick} alt='icon' />
              <h5 className={styles.info}>One click session commencement</h5>
            </div>
          </Column>
          <Column size_md='md-4' size_flex={true}>
            <div className={styles.item}>
              <img className={styles.image} src={realtime} alt='icon' />
              <h5 className={styles.info}>Realtime Dashboard Updates</h5>
            </div>
          </Column>
        </Row>
      </Container>
    </div>
  );
}
