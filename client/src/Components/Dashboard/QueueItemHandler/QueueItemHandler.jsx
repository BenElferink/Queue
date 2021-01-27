import { Fragment, useContext, useState } from 'react';
import { TokenContext } from '../../../contexts/TokenContext';
import { answerQuestion, askQuestion } from '../../../api';
import styles from './QueueItemHandler.module.css';
import DashboardSection from '../DashboardSection/DashboardSection';
import { Button, CircularProgress } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

export default function QueueItemHandler({
  text,
  setText,
  isHost,
  questToAnswerId,
  SpeechRecognition,
  handleSpeech,
  listening,
  children,
  clearLeverage,
}) {
  const { token } = useContext(TokenContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      setLoading(true);
      const data = isHost
        ? await answerQuestion(token, questToAnswerId, { answer: text })
        : await askQuestion(token, { question: text });
      if (data) {
        setLoading(false);
        setText('');
        if (isHost) clearLeverage();
      } else {
        alert('Your session has expired');
        window.location.reload();
      }
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

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                isHost && !questToAnswerId
                  ? 'Select a question from the Queue by clicking the microphone.'
                  : isHost &&
                    questToAnswerId &&
                    SpeechRecognition.browserSupportsSpeechRecognition()
                  ? 'Speak or type your answer...'
                  : isHost &&
                    questToAnswerId &&
                    !SpeechRecognition.browserSupportsSpeechRecognition()
                  ? 'Your browser does not support speech recognition, please type your answer (not required)...'
                  : 'Ask your question here...'
              }
              required={SpeechRecognition.browserSupportsSpeechRecognition()}
            />

            {isHost ? (
              // is host, notice the disabled
              <Button
                type='submit'
                variant='contained'
                disabled={
                  !questToAnswerId ||
                  (SpeechRecognition.browserSupportsSpeechRecognition() && text === '') ||
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
          </form>
        </Fragment>
      )}
    </DashboardSection>
  );
}
