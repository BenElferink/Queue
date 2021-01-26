import styles from './QuestItem.module.css';
import Avatar from '@material-ui/core/Avatar';
import MicIcon from '@material-ui/icons/Mic';
import MicOffRoundedIcon from '@material-ui/icons/MicOffRounded';
import { CircularProgress } from '@material-ui/core';

export default function QuestItem({
  item,
  user,
  answered,
  questToAnswer,
  leverageQuest,
  isMic,
  SpeechRecognition,
  handleSpeech,
  listening,
}) {
  return (
    <div className={`${styles.component} ${answered ? styles.answered : styles.notAnswered}`}>
      <div>
        {isMic && SpeechRecognition.browserSupportsSpeechRecognition() ? (
          <Avatar
            className={`${styles.avatarMic} ${!listening && styles.pointer}`}
            onClick={() => {
              if (!listening) {
                leverageQuest(item._id);
                handleSpeech();
              }
            }}>
            {listening && questToAnswer === item._id ? (
              <CircularProgress color='secondary' />
            ) : (
              <MicIcon />
            )}
          </Avatar>
        ) : isMic && !SpeechRecognition.browserSupportsSpeechRecognition() ? (
          <Avatar
            className={styles.avatarMic}
            onClick={() => alert('Your browser does not support this feature...')}>
            <MicOffRoundedIcon />
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
