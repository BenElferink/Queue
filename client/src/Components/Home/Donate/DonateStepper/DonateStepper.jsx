import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import { PayPalButton } from 'react-paypal-button-v2';
import styles from './DonateStepper.module.css';
import TextField from '@material-ui/core/TextField';

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#14322f',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#14322f',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

function QontoStepIcon(props) {
  const { active, completed } = props;

  return (
    <div className={`${styles.dots} ${active && styles.active}`}>
      {completed ? <Check className={styles.completed} /> : <div className={styles.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

export default function CustomizedSteppers() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Proceed to donate', 'Donation amount', 'Check out'];
  const [donationAmount, setDonationAmount] = React.useState();

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    if (activeStep === 1 && (donationAmount <= 0 || donationAmount == null)) {
      window.alert('Please enter a valid donation');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  return (
    <div className={styles.component}>
      <div className={styles.button}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button
          variant='contained'
          onClick={handleNext}
          className={activeStep !== 0 ? styles.blackButton : ''}
          disabled={activeStep === 2 || activeStep === 0}>
          Next
        </Button>
      </div>

      <div className={styles.stepperContent}>
        {activeStep === 0 ? (
          <Button variant='outlined' className={styles.donateNow} onClick={handleNext}>
            Donate Now
          </Button>
        ) : activeStep === 2 ? (
          <PayPalButton
            amount={donationAmount}
            options={{
              clientId: 'sb',
              currency: 'USD',
            }}
          />
        ) : (
          <TextField
            type='number'
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder='Donation Amount'
            variant='outlined'
            label='$USD'
          />
        )}
      </div>

      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
        className={styles.stepperBG}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
