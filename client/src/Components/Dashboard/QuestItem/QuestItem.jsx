import styles from './QuestItem.module.css';
import Avatar from '@material-ui/core/Avatar';
import MicIcon from '@material-ui/icons/Mic';

export default function QuestItem({
  item,
  user,
  answered,
  isMic,
  SpeechRecognition,
  handleSpeech,
}) {
  return (
    <div className={`${styles.component} ${answered ? styles.answered : styles.notAnswered}`}>
      <div>
        {isMic && SpeechRecognition.browserSupportsSpeechRecognition() ? (
          <Avatar className={styles.avatarMic} onClick={handleSpeech}>
            <MicIcon />
          </Avatar>
        ) : isMic && !SpeechRecognition.browserSupportsSpeechRecognition() ? (
          <Avatar
            className={styles.avatarMic}
            onClick={() => alert('Your browser does not support this feature...')}>
            <MicIcon />
          </Avatar>
        ) : (
          <Avatar className={styles.avatar}>{user.username[0]}</Avatar>
        )}
        <span>{user.username}</span>
      </div>

      <p className={styles.question}>Q: {item.question}</p>
      {answered && <p className={styles.answer}>A: {item.answer}</p>}
    </div>
  );
}
