import { useContext, useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Pusher from 'pusher-js';
import FlipMove from 'react-flip-move';
import { SessionContext } from './../../contexts/SessionContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import QuestItem from './QuestItem/QuestItem';
import QueueItemHandler from './QueueItemHandler/QueueItemHandler';
import DashboardSection from './DashboardSection/DashboardSection';
import MobileNavigation from './MobileNavigation/MobileNavigation';

const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
  cluster: 'ap2',
});

export default function Dashboard({ isHost }) {
  const { session, setSession } = useContext(SessionContext);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');
  const [questToAnswer, setQuestToAnswer] = useState(null);
  const [mobileNav, setMobileNav] = useState({
    section1: true,
    section2: false,
    section3: false,
  });

  // this side effect subscribes to the pusher channel, using the channel ID
  // subscription happens only if the session ID exists, meaning the session was fetched
  useEffect(() => {
    const channel = pusher.subscribe(`session-${session._id}`);
    channel.bind('update-session', function (data) {
      setSession(data.session);
    });

    return () => {
      pusher.unsubscribe();
      pusher.unbind_all();
    };
  }, [session, setSession]);

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

  // this side effect keeps the spoken transcript in a state (can be presented in UI)
  useEffect(() => {
    if (transcript && listening) setText(transcript);
  }, [transcript, listening]);

  return (
    <div className={styles.component}>
      <div className={styles.baseGlass}>
        <div className={`${styles.hide} ${mobileNav.section1 && styles.show}`}>
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
        </div>
        {/* ask or answer question (modified for use on both user && host dashboard) */}
        <div className={`${styles.hide} ${mobileNav.section2 && styles.show}`}>
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
        </div>

        <div className={`${styles.hide} ${mobileNav.section3 && styles.show}`}>
          <DashboardSection title='History'>
            {/* answered queue (modified for use on both user && host dashboard) */}
            <FlipMove>
              {history.map((item, i) => (
                <QuestItem
                  key={item._id}
                  item={item}
                  user={session.users.find((user) => user._id === item.from)}
                  answered={true}
                />
              ))}
            </FlipMove>
          </DashboardSection>
        </div>
      </div>
      <MobileNavigation />
    </div>
  );
}
