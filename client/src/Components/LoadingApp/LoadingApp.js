import styles from './styles/LoadingApp.module.css';
import newQueue from './images/newQueue.svg';

export default function LoadingApp() {
  return (
    <div className={styles.component}>
      <embed src={newQueue} alt='' />
    </div>
  );
}
