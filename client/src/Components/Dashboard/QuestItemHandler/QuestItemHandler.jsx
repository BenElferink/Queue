import { Fragment, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../../app/SocketContext';
import styles from './QuestItemHandler.module.css';
import DashboardSection from '../DashboardSection/DashboardSection';
import { Button, CircularProgress } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

export default function QuestItemHandler({
  text,
  setText,
  isHost,
  leveragedQuestId,
  clearLeveragedQuest,
  SpeechRecognition,
  handleSpeech,
  listening,
  children,
}) {
  const { socket } = useContext(SocketContext);
  const { token } = useSelector((state) => state.authReducer);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    (() => {
      setLoading(true);
      isHost
        ? socket.emit('answer', { token, questId: leveragedQuestId, answer: text }, (error) => {
            if (error) console.log(error);
            setText('');
            setLoading(false);
            clearLeveragedQuest();
          })
        : socket.emit('ask', { token, question: text }, (error) => {
            if (error) console.log(error);
            setText('');
            setLoading(false);
          });
    })();
  };

  return (
    <DashboardSection title={isHost ? 'Answer' : 'Ask'}>
      {loading ? (
        <div className={styles.centerThis}>
          <CircularProgress color='secondary' />
        </div>
      ) : (
        <Fragment>
          <form className={styles.form} onSubmit={handleSubmit}>
            {children}

            {isHost && listening ? (
              // ONLY! if host and mic is on
              <Button onClick={handleSpeech} variant='contained' endIcon={<MicIcon />}>
                disable mic
              </Button>
            ) : !isHost && SpeechRecognition.browserSupportsSpeechRecognition() ? (
              // ONLY! if user and mic is supported
              <Button variant='contained' endIcon={<MicIcon />} onClick={handleSpeech}>
                {listening ? 'disable mic' : 'enable mic'}
              </Button>
            ) : (
              ''
            )}

            {isHost ? (
              // is host, notice the disabled
              <Button
                type='submit'
                variant='contained'
                disabled={
                  !leveragedQuestId ||
                  (SpeechRecognition.browserSupportsSpeechRecognition() && listening)
                }
                endIcon={<SendIcon />}>
                apply answer
              </Button>
            ) : (
              // is user, notice the disabled
              <Button
                type='submit'
                variant='contained'
                disabled={text === '' || listening}
                endIcon={<SendIcon />}>
                send question
              </Button>
            )}

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                isHost && !leveragedQuestId
                  ? 'Select a question from the Queue by clicking the microphone.'
                  : isHost &&
                    leveragedQuestId &&
                    SpeechRecognition.browserSupportsSpeechRecognition()
                  ? 'Speak or type your answer...'
                  : isHost &&
                    leveragedQuestId &&
                    !SpeechRecognition.browserSupportsSpeechRecognition()
                  ? 'Your browser does not support speech recognition, please type your answer (not required)...'
                  : 'Ask your question here...'
              }
            />
          </form>
        </Fragment>
      )}
    </DashboardSection>
  );
}
