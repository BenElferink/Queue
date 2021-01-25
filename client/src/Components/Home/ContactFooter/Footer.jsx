import { Chip } from '@material-ui/core';
import './Footer.css';
import MailIcon from '@material-ui/icons/Mail';

export default function Footer() {
  return (
    <div className='contact' id='ContactInfo'>
      <div className='contact__quote'>
        <h4>"The only certainties in life are death, taxes and bugs in code."</h4>
        <h6>
          Help us improve the software! Report the issues/errors you find with screenshots to one of
          the following mail-IDs
        </h6>
      </div>
      <div className='contact__email'>
        <Chip
          icon={<MailIcon />}
          className='contain__chip'
          label='Ben Elferink'
          component='a'
          href='mailto:ben.elferink@icloud.com'
          clickable
        />
        <Chip
          icon={<MailIcon />}
          className='contain__chip'
          label='Aman Kuvera'
          component='a'
          href='mailto:kuveraaman1999@gmail.com'
          clickable
        />
      </div>
    </div>
  );
}
