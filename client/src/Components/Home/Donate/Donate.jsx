import styles from './Donate.module.css';
import { Button } from '@material-ui/core';

export default function Donate() {
  return (
    <div className={styles.component} id='Support_the_Application'>
      <h1>
        Like our <span>App</span>?
      </h1>
      <br />
      <span>
        “It's not how much we give but how much love we put into giving.” ― Mother Theresa
      </span>
      <br />
      <p>
        Hey there User! This application might not be the best of what is possible. There might be
        far more things that can be improved. But we've made this out of nothing. So imagine if we
        had a good funding!
      </p>
      <Button size='large' variant='outlined'>
        Donate Now
      </Button>
    </div>
  );
}
