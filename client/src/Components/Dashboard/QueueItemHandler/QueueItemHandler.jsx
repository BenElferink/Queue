import { useContext, useState } from 'react';
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
  questToAnswer,
  SpeechRecognition,
  handleSpeech,
  listening,
}) {
  const { token } = useContext(TokenContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      setLoading(true);
      const data = isHost
        ? await answerQuestion(token, questToAnswer, { answer: text })
        : await askQuestion(token, { question: text });
      if (data) {
        setLoading(false);
        setText('');
      } else {
        alert('An unexpected error occured');
      }
    })();
  };

  return (
    <DashboardSection title={isHost ? 'HOST TEST' : 'Ask...?'}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {loading ? (
          <CircularProgress color='secondary' />
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isHost
                ? 'Select a question from the queue by clicking the mic...'
                : 'Ask your question here...'
            }
            required
          />
        )}

        {isHost && listening && (
          <Button onClick={handleSpeech} variant='contained' endIcon={<MicIcon />}>
            disable mic
          </Button>
        )}

        {isHost && !listening && text !== '' && (
          <Button type='submit' variant='contained' disabled={text === ''} endIcon={<SendIcon />}>
            apply answer
          </Button>
        )}

        {!isHost && SpeechRecognition.browserSupportsSpeechRecognition() && (
          <Button variant='contained' endIcon={<MicIcon />} onClick={handleSpeech}>
            {listening ? 'disable mic' : 'enable mic'}
          </Button>
        )}

        {!isHost && (
          <Button
            type='submit'
            variant='contained'
            disabled={text === '' || listening}
            endIcon={<SendIcon />}>
            send question
          </Button>
        )}
      </form>
    </DashboardSection>
  );
}
