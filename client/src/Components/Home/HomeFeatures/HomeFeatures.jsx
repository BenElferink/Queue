import React from 'react';
import './HomeFeatures.css';
import HistoryFeature from './../../../images/HistoryFeature.svg';
import voiceText from './../../../images/voiceText.svg';
import timeQueue from './../../../images/timeQueue.svg';
import timerDoubt from './../../../images/timerDoubt.svg';
import oneClick from './../../../images/oneClick.svg';
import IndividualFeature from './IndividualFeature';
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.js';

function HomeFeatures() {
  return (
    <div className='features'>
      <h1>Features</h1>
      <div className='features__list container'>
        <div className='row'>
          <div className='col-md-4'>
            <IndividualFeature
              featureName='History Record of Answered Questions'
              imgSrc={HistoryFeature}
            />
          </div>
          <div className='col-md-4'>
            <IndividualFeature
              featureName='Voice to Text Conversion of Answers'
              imgSrc={voiceText}
            />
          </div>
          <div className='col-md-4'>
            <IndividualFeature featureName='Timestamp Based Questions Queue' imgSrc={timeQueue} />
          </div>
        </div>

        <div className='row'>
          <div className='col-md-6'>
            <IndividualFeature
              featureName='Set Timer for Doubt Clearance Session'
              imgSrc={timerDoubt}
            />
          </div>
          <div className='col-md-6'>
            <IndividualFeature featureName='One Click Session Commencement' imgSrc={oneClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeFeatures;
