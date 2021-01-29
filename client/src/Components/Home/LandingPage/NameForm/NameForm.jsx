import { Fragment, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SocketContext } from '../../../../app/SocketContext';
import { createdRoom, joinedRoom } from '../../../../app/actions';
import styles from './NameForm.module.css';
import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function NameForm({ isHost, roomId }) {
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const [input, setInp] = useState('');

  // this function makes a request to the backend, controlled by isHost (true/false)
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    isHost
      ? socket.emit('create', { username: input }, (error) => {
          if (error) {
            console.log(error);
            setLoading(false);
          }
        })
      : socket.emit('join', { roomId, username: input }, (error) => {
          if (error) {
            console.log(error);
            setLoading(false);
          }
        });
  };

  useEffect(() => {
    const created = (data) => {
      dispatch(createdRoom({ token: data.token, roomId: data.roomId }));
    };
    const joined = (data) => {
      dispatch(joinedRoom({ token: data.token, roomId: data.roomId, queue: data.queue }));
    };

    isHost ? socket.on('created', created) : socket.on('joined', joined);
    return () => {
      isHost ? socket.off('created', created) : socket.off('joined', joined);
    };
    // eslint-disable-next-line
  }, [isHost, socket]);

  return (
    <Fragment>
      {loading ? (
        <CircularProgress color='secondary' />
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type='text' value={input} onChange={(e) => setInp(e.target.value)} required />
          <Button
            type='submit'
            variant='contained'
            startIcon={<AddCircleIcon />}
            disabled={input === ''}>
            {isHost ? 'CREATE' : 'JOIN'}
          </Button>
        </form>
      )}
    </Fragment>
  );
}
