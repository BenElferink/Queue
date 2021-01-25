import { useState } from 'react';
import styles from './StartSession.module.css';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
// import { newSession } from '../../../api';

export default function StartSession() {
  const [hostNameInput, setHostNameInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const response = await newSession({ username: hostNameInput });
    // console.log(response);
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

      <ExpandMoreRoundedIcon />
    </div>
  );
}
