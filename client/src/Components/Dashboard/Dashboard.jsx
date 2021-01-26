import { useContext, useState, useEffect } from 'react';
import { SessionContext } from './../../contexts/SessionContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styles from './Dashboard.module.css';
import DashboardSection from './DashboardSection/DashboardSection';
import QueueItemHandler from './QueueItemHandler/QueueItemHandler';
import QuestItem from './QuestItem/QuestItem';

export default function Dashboard({ isHost }) {
  const { session } = useContext(SessionContext);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');

  const handleSpeech = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setListening(false);
      resetTranscript();
    } else {
      await SpeechRecognition.startListening({ continuous: true });
      setListening(true);
    }
  };

  useEffect(() => {
    if (transcript && listening) setText(transcript);
  }, [transcript, listening]);

  return (
    <div className={styles.component}>
      <div className={styles.baseGlass}>
        <DashboardSection title='Queue'>
          {/* questions queue (modified for use on both user && host dashboard) */}
          {session.queue.map((item, i) => (
            <QuestItem
              key={i}
              item={item}
              user={session.users.find((user) => user._id === item.from)}
              answered={false}
              isMic={isHost}
              SpeechRecognition={SpeechRecognition}
              handleSpeech={handleSpeech}
            />
          ))}
        </DashboardSection>

        {/* ask or answer question (modified for use on both user && host dashboard) */}
        <QueueItemHandler
          isHost={isHost}
          text={text}
          setText={setText}
          SpeechRecognition={SpeechRecognition}
          handleSpeech={handleSpeech}
          listening={listening}
        />

        <DashboardSection title='History'>
          {/* answered queue (modified for use on both user && host dashboard) */}
          {session.history.map((item, i) => (
            <QuestItem
              key={i}
              item={item}
              user={session.users.find((user) => user._id === item.from)}
              answered={true}
            />
          ))}

          {/* Start : This part is hard coded for testing purposes, Exclude from deployment */}
          <QuestItem
            answered={true}
            key={123}
            item={{
              question: 'My name is Aman and what is yours?',
              answer: 'Hey Aman, I am Ben. This Project is gonna rock and people will love it.',
            }}
            user={{ username: 'Aman' }}
          />
          {/* End : This part is hard code for testing purposes, Exclude from deployment */}
        </DashboardSection>
      </div>
    </div>
  );
}
