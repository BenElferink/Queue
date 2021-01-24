import { useEffect, useState } from 'react';
import './Canvas.css';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

function Canvas() {
  const [hostNameInput, setHostNameInput] = useState('');
  const [disableHostButton, setDisableHostButton] = useState(true);

  useEffect(() => {
    if (hostNameInput !== '') {
      setDisableHostButton(false);
    } else {
      setDisableHostButton(true);
    }
  }, [hostNameInput]);

  return (
    <div className='canvas'>
      <div className='canvas__text'>
        <h1>
          Want to start a <span>Session</span>?
        </h1>
        <p>You are just one click away, Enter your Name and Boom!! It's already created.</p>
        <div className='canvas__InputField'>
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
            disabled={disableHostButton}>
            Host
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Canvas;
