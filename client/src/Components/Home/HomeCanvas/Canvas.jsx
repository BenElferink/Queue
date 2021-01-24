import { useState } from 'react';
import './Canvas.css';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { newSession } from './../../../api';

function Canvas() {
  const [hostNameInput, setHostNameInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await newSession({ username: hostNameInput });
    console.log(response);
  };

  return (
    <div className='canvas'>
      <div className='canvas__text'>
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
        <form className='canvas__InputField' onSubmit={handleSubmit}>
          <input
            type='text'
            value={hostNameInput}
            onChange={(e) => setHostNameInput(e.target.value)}
            required
          />
          <Button
            variant='contained'
            startIcon={<AddCircleIcon />}
            color='primary'
            type='submit'
            disabled={hostNameInput === ''}>
            Host
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Canvas;
