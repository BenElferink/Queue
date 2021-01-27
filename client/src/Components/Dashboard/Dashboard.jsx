import { useContext, useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import FlipMove from 'react-flip-move';
import { SessionContext } from './../../contexts/SessionContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import QuestItem from './QuestItem/QuestItem';
import QueueItemHandler from './QueueItemHandler/QueueItemHandler';
import DashboardSection from './DashboardSection/DashboardSection';
import MobileNavigation from './MobileNavigation/MobileNavigation';

import { TokenContext } from '../../contexts/TokenContext';
import { getSession } from './../../api';
// import { io } from 'socket.io-client';
// const socket = io('ws:https://localhost:4000');

export default function Dashboard({ isHost }) {
  const { token } = useContext(TokenContext);
  const { session, setSession } = useContext(SessionContext);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);

  // console.log('socket', socket);

  // temporary 10-second interval for fetching the session data,
  // will be replaced with socket.io
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await getSession(token);
      if (response) {
        setSession(response.session);
      } else {
        console.log('dev error');
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  });

  // this side effect is reposnaible for sorting the queue and history
  // queue is FIFO, history is LIFO
  useEffect(() => {
    const sortedQueue = session.queue.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    const sortedHistory = session.history.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    );
    setQueue(sortedQueue);
    setHistory(sortedHistory);
  }, [session.queue, session.history]);

  const { transcript, resetTranscript } = useSpeechRecognition();
  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');
  const [questToAnswer, setQuestToAnswer] = useState(null);

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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 868 ? true : false);
  const [mobileNav, setMobileNav] = useState({
    section1: true,
    section2: true,
    section3: true,
  });

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
              {queue.map(
                (item) =>
                  item._id !== questToAnswer?._id && (
                    <QuestItem
                      key={item._id}
                      item={item}
                      user={session.users.find((user) => user._id === item.from)}
                      answered={false}
                      questToAnswerId={questToAnswer?._id}
                      leverageQuest={() => setQuestToAnswer(item)}
                      isHost={isHost}
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
            questToAnswerId={questToAnswer?._id}
            SpeechRecognition={SpeechRecognition}
            handleSpeech={handleSpeech}
            listening={listening}
            clearLeverage={() => setQuestToAnswer(null)}>
            {questToAnswer && (
              <QuestItem
                item={queue.find((quest) => quest._id === questToAnswer._id)}
                user={session.users.find((user) => user._id === questToAnswer.from)}
                answered={false}
                questToAnswerId={questToAnswer._id}
                leverageQuest={() => null}
                isHost={isHost}
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
              {history.map((item) => (
                <QuestItem
                  key={item._id}
                  item={item}
                  user={session.users.find((user) => user._id === item.from)}
                  answered={true}
                />
              ))}
            </FlipMove>
          </DashboardSection>
        )}
      </div>
      {isMobile && <MobileNavigation setMobileNav={setMobileNav} />}
    </div>
  );
}
