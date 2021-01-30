import { forwardRef, useContext } from 'react';
import { SocketContext } from '../../../app/SocketContext';
import { useSelector } from 'react-redux';
import styles from './QuestItem.module.css';
import { Avatar, CircularProgress, IconButton } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffRoundedIcon from '@material-ui/icons/MicOffRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import CancelIcon from '@material-ui/icons/Cancel';

export default forwardRef(function QuestItem(
  { item, isHost, leveragedQuestId, leverageQuest, SpeechRecognition, handleSpeech, listening },
  ref,
) {
  const { socket } = useContext(SocketContext);
  const { userId, token } = useSelector((state) => state.authReducer);

  const deleteQuestion = () => {
    // window.alert('This Function should delete this messagess');
    socket.emit('delete-quest', { token, questId: item._id }, (error) => {
      if (error) console.log(error);
    });
  };

  return (
    <div
      ref={ref}
      className={`${styles.component} ${item?.answered ? styles.answered : styles.notAnswered}`}>
      <div>
        {(isHost || item?.from._id === userId) && !item?.answered && (
          <IconButton onClick={deleteQuestion}>
            <CancelIcon />
          </IconButton>
        )}
        <span>{item?.from.username}</span>

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
                leveragedQuestId === item?._id &&
                listening) ||
              // OR IF! microphone is not supported and question IS leveraged
              (!SpeechRecognition.browserSupportsSpeechRecognition() &&
                leveragedQuestId === item?._id) ? (
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
        ) : item?.answered ? (
          <Avatar className={styles.avatar}>
            <DoneRoundedIcon />
          </Avatar>
        ) : (
          <Avatar className={styles.avatar}>{item?.from.username[0]}</Avatar>
        )}
      </div>

      <p className={styles.question}>Q: {item?.question}</p>
      {item?.answered && item?.answer && <p className={styles.answer}>A: {item?.answer}</p>}
    </div>
  );
});
