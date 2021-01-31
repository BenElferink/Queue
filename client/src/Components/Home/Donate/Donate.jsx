import styles from './Donate.module.css';
import DonateStepper from './DonateStepper/DonateStepper.jsx';
// https://www.npmjs.com/package/react-paypal-button-v2

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
        Hey there User! Thanks for using Queue. <br />
        We are sure that you loved the application. <br />
        Help us grow larger and better,
        <br /> Click the button below to donate now! <br />
        <span>
          ( For long-term funding, mail to any one of the email-Ids in the contact section below. )
        </span>
      </p>
      <DonateStepper />
    </div>
  );
}
