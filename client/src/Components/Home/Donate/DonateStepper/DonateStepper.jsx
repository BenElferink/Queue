import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
      borderColor: '#784af4',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}>
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

function getSteps() {
  return ['Proceed to donate', 'Enter a donation amount', 'Check out'];
}

export default function CustomizedSteppers() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [donationAmount, setDonationAmount] = React.useState();

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  return (
    <div className={styles.root}>
      <div>
        {activeStep === 0 ? (
          ''
        ) : activeStep === steps.length - 1 ? (
          <PayPalButton amount={donationAmount} />
        ) : (
          <TextField
            type='number'
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder='Donation Amount'
            variant='outlined'
            defaultValue={4}
            label='$USD'
          />
        )}
        <div>
          <Button disabled={activeStep === 0} onClick={handleBack} className={styles.button}>
            Back
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            className={styles.button}>
            {activeStep === 0 ? 'Donate Now' : 'Next'}
          </Button>
        </div>

        <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
}
