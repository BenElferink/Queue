import styles from './LoadingApp.module.css';
import newQueue from './newQueue.svg';

export default function LoadingApp() {
  return (
    <div className={styles.component}>
      <embed src={newQueue} alt='' />
    </div>
  );
}
