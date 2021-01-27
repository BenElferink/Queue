import { forwardRef } from 'react';
import styles from './QuestItem.module.css';
import Avatar from '@material-ui/core/Avatar';
import MicIcon from '@material-ui/icons/Mic';
import MicOffRoundedIcon from '@material-ui/icons/MicOffRounded';
import { CircularProgress } from '@material-ui/core';

export default forwardRef(function QuestItem(
  {
    item,
    user,
    answered,
    questToAnswerId,
    leverageQuest,
    isMic,
    SpeechRecognition,
    handleSpeech,
    listening,
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`${styles.component} ${answered ? styles.answered : styles.notAnswered}`}>
      <div>
        {isMic && SpeechRecognition.browserSupportsSpeechRecognition() ? (
          <Avatar
            className={`${styles.avatarMic} ${!listening && styles.pointer}`}
            onClick={() => {
              if (!listening) {
                leverageQuest();
                handleSpeech();
              }
            }}>
            {listening && questToAnswerId === item._id ? (
              <CircularProgress color='secondary' />
            ) : (
              <MicIcon />
            )}
          </Avatar>
        ) : isMic && !SpeechRecognition.browserSupportsSpeechRecognition() ? (
          <Avatar
            className={`${styles.avatarMic} ${!listening && styles.pointer}`}
            onClick={() => {
              leverageQuest();
              // alert('Your browser does not support this feature...');
            }}>
            {questToAnswerId === item._id ? (
              <CircularProgress color='secondary' />
            ) : (
              <MicOffRoundedIcon />
            )}
          </Avatar>
        ) : (
          <Avatar className={styles.avatar}>{user?.username[0]}</Avatar>
        )}
        <span>{user?.username}</span>
      </div>

      <p className={styles.question}>Q: {item?.question}</p>
      {answered && <p className={styles.answer}>A: {item?.answer}</p>}
    </div>
  );
});
