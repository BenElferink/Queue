import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { requestSession } from '../../../api';
import styles from './LandingPage.module.css';
import NameForm from './NameForm/NameForm';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';

export default function LandingPage({ isHost }) {
  const { id } = useParams();
  const [hostName, setHostName] = useState('');

  // this side effect requests the session,
  // then receives the host name and sets that name inot state, to display in the UI
  useEffect(() => {
    if (id) {
      (async () => {
        const data = await requestSession(id);
        if (data) {
          setHostName(data.session.host.username);
        } else {
          console.log('Unexpected error: tried to request session');
        }
      })();
    }
  }, [id]);

  return (
    <div className={styles.component} id='home'>
      <div className={styles.text}>
        {isHost ? (
          <h1>
            Want to start a <span>Session</span>?
          </h1>
        ) : (
          <h1>
            Join <span>{hostName}</span>'s session!'
          </h1>
        )}

        <p>
          You are just one click away! Enter your name! (it's that easy)
          <br />
          <span>
            <u>Disclaimer:</u> We do not collect any data!
          </span>
        </p>
      </div>
      <NameForm isHost={isHost} sessionId={id} />
      <ExpandMoreRoundedIcon />
    </div>
  );
}
