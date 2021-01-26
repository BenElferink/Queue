import { useContext } from 'react';
import { SessionContext } from './../../contexts/SessionContext';
import styles from './Dashboard.module.css';
import DashboardSection from './DashboardSection/DashboardSection';
import QuestionItem from './QuestionItem/QuestionItem';
import HistoryItem from './HistoryItem/HistoryItem';
import AskQuestion from './AskQuestion/AskQuestion';
import AnswerQuestion from './AnswerQuestion/AnswerQuestion';

export default function Dashboard({ isHost }) {
  const { session } = useContext(SessionContext);

  return (
    <div className={styles.component}>
      <div className={styles.baseGlass}>
        <DashboardSection title='Queue'>
          {session.queue.map((item, i) => (
            <QuestionItem
              key={i}
              item={item}
              user={session.users.find((user) => user._id === item.from)}
            />
          ))}
        </DashboardSection>

        {isHost ? <AnswerQuestion /> : <AskQuestion />}

        <DashboardSection title='History'>
          {session.history.map((item, i) => (
            <HistoryItem
              key={i}
              item={item}
              user={session.users.find((user) => user._id === item.from)}
            />
          ))}
        </DashboardSection>
      </div>
    </div>
  );
}
