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
  const [questToAnswer, setQuestToAnswer] = useState('');

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
              questToAnswer={questToAnswer}
              leverageQuest={setQuestToAnswer}
              isMic={isHost}
              SpeechRecognition={SpeechRecognition}
              handleSpeech={handleSpeech}
              listening={listening}
            />
          ))}
        </DashboardSection>

        {/* ask or answer question (modified for use on both user && host dashboard) */}
        <QueueItemHandler
          text={text}
          setText={setText}
          isHost={isHost}
          questToAnswer={questToAnswer}
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
        </DashboardSection>
      </div>
    </div>
  );
}
