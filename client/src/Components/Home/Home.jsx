import { Fragment } from 'react';
import StartSession from './StartSession/StartSession';
import About from './About/About';
import Features from './Features/Features';
import Donate from './Donate/Donate';
import Footer from './ContactFooter/Footer';

export default function Home() {
  return (
    <Fragment>
      <StartSession />
      <About />
      <Features />
      <Donate />
      <Footer />
    </Fragment>
  );
}
