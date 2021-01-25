import { useState, useContext } from 'react';
import { TokenContext } from './../../../contexts/TokenContext';
import { SessionContext } from './../../../contexts/SessionContext';
import { newSession } from '../../../api';
import styles from './StartSession.module.css';
import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';

export default function StartSession() {
  const { setToken } = useContext(TokenContext);
  const { setSession } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [hostNameInput, setHostNameInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await newSession({ username: hostNameInput });
    setToken(data.token);
    setSession(data.session);
  };

  return (
    <div className={styles.component}>
      <div className={styles.text}>
        <h1>
          Want to start a <span>Session</span>?
        </h1>
        <p>
          You are just one click away! Enter your name! (it's that easy)
          <br />
          <span>
            <u>Disclaimer:</u> We do not collect any data!
          </span>
        </p>
      </div>

      {loading ? (
        <CircularProgress color='secondary' />
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type='text'
            value={hostNameInput}
            onChange={(e) => setHostNameInput(e.target.value)}
            required
          />
          <Button
            type='submit'
            variant='contained'
            startIcon={<AddCircleIcon />}
            disabled={hostNameInput === ''}>
            Host
          </Button>
        </form>
      )}

      <ExpandMoreRoundedIcon />
    </div>
  );
}
