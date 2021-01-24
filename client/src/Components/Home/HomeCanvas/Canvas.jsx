import React, { useState } from 'react';
import './Canvas.css';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

function Canvas() {
  const [hostNameInput, setHostNameInput] = useState('');
  return (
    <div className='canvas'>
      <div className='canvas__text'>
        <h1>
          Want to start a <span>Session</span>?
        </h1>
        <p>
          You are just one click away! Just enter your name! (it's that simple)
          <br />
          <span>
            <u>Disclaimer</u>: we do not collect any data!
          </span>
        </p>
        <div className='canvas__InputField'>
          <input
            type='text'
            value={hostNameInput}
            onChange={(e) => setHostNameInput(e.target.value)}
            required
          />
          <Button variant='contained' startIcon={<AddCircleIcon />} color='primary'>
            Host
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Canvas;
