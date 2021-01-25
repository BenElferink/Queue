import StartSession from './StartSession/StartSession';
import About from './About/About';
import HomeFeatures from './HomeFeatures/HomeFeatures';
import Donate from './Donate/Donate';
import Footer from './ContactFooter/Footer';

function Home() {
  return (
    <div>
      <StartSession />
      <About />
      <HomeFeatures />
      <Donate />
      <Footer />
    </div>
  );
}

export default Home;
