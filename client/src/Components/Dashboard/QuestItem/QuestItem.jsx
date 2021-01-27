import { forwardRef } from 'react';
import styles from './QuestItem.module.css';
import { Avatar, CircularProgress } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffRoundedIcon from '@material-ui/icons/MicOffRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';

export default forwardRef(function QuestItem(
  {
    item,
    user,
    answered,
    isHost,
    SpeechRecognition,
    handleSpeech,
    listening,
    leverageQuest,
    questToAnswerId,
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`${styles.component} ${answered ? styles.answered : styles.notAnswered}`}>
      <div>
        {isHost ? (
          <Avatar
            className={`${styles.avatarMic} ${!listening && styles.pointer}`}
            onClick={() => {
              if (!listening) {
                leverageQuest();
                if (SpeechRecognition.browserSupportsSpeechRecognition()) handleSpeech();
              }
            }}>
            {
              // IF! microphone is supported and is ON (listening)
              (SpeechRecognition.browserSupportsSpeechRecognition() &&
                questToAnswerId === item._id &&
                listening) ||
              // OR IF! microphone is not supported and question IS leveraged
              (!SpeechRecognition.browserSupportsSpeechRecognition() &&
                questToAnswerId === item._id) ? (
                <CircularProgress color='secondary' />
              ) : // ELSE! if microphone is supported and is OFF (NOT-listening)
              SpeechRecognition.browserSupportsSpeechRecognition() ? (
                <MicIcon />
              ) : (
                // ELSE! if microphone is not supported and question IS NOT leveraged
                <MicOffRoundedIcon />
              )
            }
          </Avatar>
        ) : answered ? (
          <Avatar className={styles.avatar}>
            <DoneRoundedIcon />
          </Avatar>
        ) : (
          <Avatar className={styles.avatar}>{user?.username[0]}</Avatar>
        )}
        <span>{user?.username}</span>
      </div>

      <p className={styles.question}>Q: {item?.question}</p>
      {answered && item.answer && <p className={styles.answer}>A: {item.answer}</p>}
    </div>
  );
});
