import { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { answeredQuestion, askedQuestion } from '../../app/actions';
import { SocketContext } from '../../app/SocketContext';
import styles from './Dashboard.module.css';
import FlipMove from 'react-flip-move';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import QuestItem from './QuestItem/QuestItem';
import QueueItemHandler from './QueueItemHandler/QueueItemHandler';
import DashboardSection from './DashboardSection/DashboardSection';
import MobileNavigation from './MobileNavigation/MobileNavigation';

export default function Dashboard({ isHost }) {
  const dispatch = useDispatch();
  const { queue, history } = useSelector((state) => state.roomReducer);
  const { socket } = useContext(SocketContext);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const [unAnswered, setUnAnswered] = useState([]);
  const [answered, setAnswered] = useState([]);

  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');
  const [leveragedQuest, setLeveragedQuest] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 868 ? true : false);
  const [mobileNav, setMobileNav] = useState({
    section1: true,
    section2: true,
    section3: true,
  });

  useEffect(() => {
    const asked = (data) => {
      dispatch(askedQuestion({ quest: data.quest }));
    };
    const answered = (data) => {
      dispatch(answeredQuestion({ quest: data.quest }));
    };
    socket.on('asked', asked);
    socket.on('answered', answered);
    return () => {
      socket.off('asked', asked);
      socket.off('answered', answered);
    };
    // eslint-disable-next-line
  }, [isHost, socket]);

  // this side effect is reposnaible for extracting the queue,
  // and arranging the dashboard logic from it
  // unAnswered is FIFO, answered is LIFO
  useEffect(() => {
    // sort by timestamps (updatedAt)
    const unAnsweredQuests = queue.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    const answeredQuests = history.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    // set changes to local state
    setUnAnswered(unAnsweredQuests);
    setAnswered(answeredQuests);
  }, [history, queue]);

  // this side effect keeps the spoken transcript in a state (can be presented in UI)
  useEffect(() => {
    if (transcript && listening) setText(transcript);
  }, [transcript, listening]);

  // this function enables and disables the microphone
  const handleSpeech = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setListening(false);
    } else {
      resetTranscript();
      await SpeechRecognition.startListening({ continuous: true });
      setListening(true);
    }
  };

  useEffect(() => {
    const configMobile = () => {
      // if window is less than 868px
      if (window.innerWidth <= 868) {
        if (!isMobile) setIsMobile(true);
      } else {
        if (isMobile) {
          setIsMobile(false);
          setMobileNav({
            section1: true,
            section2: true,
            section3: true,
          });
        }
      }
    };
    // if (window.innerWidth <= 868) configMobile();
    window.addEventListener('resize', configMobile);
    return () => {
      window.removeEventListener('resize', configMobile);
    };
    // eslint-disable-next-line
  }, [window.innerWidth]);

  return (
    <div className={styles.component}>
      <div className={styles.baseGlass}>
        {mobileNav.section1 && (
          <DashboardSection title='Queue'>
            {/* questions queue (modified for use on both user && host dashboard) */}
            <FlipMove>
              {unAnswered.map(
                (item) =>
                  item._id !== leveragedQuest?._id && (
                    <QuestItem
                      key={item._id}
                      item={item}
                      isHost={isHost}
                      leveragedQuestId={leveragedQuest?._id}
                      leverageQuest={() => setLeveragedQuest(item)}
                      SpeechRecognition={SpeechRecognition}
                      handleSpeech={handleSpeech}
                      listening={listening}
                    />
                  ),
              )}
            </FlipMove>
          </DashboardSection>
        )}

        {/* ask or answer question (modified for use on both user && host dashboard) */}
        {mobileNav.section2 && (
          <QueueItemHandler
            text={text}
            setText={setText}
            isHost={isHost}
            leveragedQuestId={leveragedQuest?._id}
            clearLeveragedQuest={() => setLeveragedQuest(null)}
            SpeechRecognition={SpeechRecognition}
            handleSpeech={handleSpeech}
            listening={listening}>
            {leveragedQuest && (
              <QuestItem
                item={queue.find((quest) => quest._id === leveragedQuest._id)}
                isHost={isHost}
                leveragedQuestId={leveragedQuest._id}
                leverageQuest={() => null}
                SpeechRecognition={SpeechRecognition}
                handleSpeech={handleSpeech}
                listening={listening}
              />
            )}
          </QueueItemHandler>
        )}

        {mobileNav.section3 && (
          <DashboardSection title='History'>
            {/* answered queue (modified for use on both user && host dashboard) */}
            <FlipMove>
              {answered.map((item) => (
                <QuestItem key={item._id} item={item} />
              ))}
            </FlipMove>
          </DashboardSection>
        )}
      </div>
      {isMobile && <MobileNavigation setMobileNav={setMobileNav} isHost={isHost}/>}
    </div>
  );
}
