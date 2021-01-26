import { useContext, useState } from 'react';
import { TokenContext } from '../../../contexts/TokenContext';
import { askQuestion } from '../../../api';
import styles from './AskQuestion.module.css';
import DashboardSection from '../DashboardSection/DashboardSection';
import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

function AskQuestion() {
  const { token } = useContext(TokenContext);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      setLoading(true);
      const data = await askQuestion(token, { question: input });
      if (data) {
        setLoading(false);
        setInput('');
      } else {
        alert('An unexpected error occured');
      }
    })();
  };

  return (
    <DashboardSection title='Ask A Question'>
      <form className={styles.form} onSubmit={handleSubmit}>
        {loading ? (
          <CircularProgress color='secondary' />
        ) : (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter Your Question Here'
            required
          />
        )}
        <Button type='submit' variant='contained' disabled={input === ''} endIcon={<SendIcon />}>
          Ask Question
        </Button>
        <Button type='submit' variant='contained' endIcon={<MicIcon />}>
          Speech to Text
        </Button>
      </form>
    </DashboardSection>
  );
}

export default AskQuestion;
