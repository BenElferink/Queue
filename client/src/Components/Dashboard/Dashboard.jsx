import { useContext } from 'react';
import { SessionContext } from './../../contexts/SessionContext';
import styles from './Dashboard.module.css';
import DashboardSection from './DashboardSection/DashboardSection';
import AskQuestion from './AskQuestion/AskQuestion';
import AnswerQuestion from './AnswerQuestion/AnswerQuestion';
import QuestAnsTemplate from './QuestAnsTemplate/QuestAnsTemplate';

export default function Dashboard({ isHost }) {
  const { session } = useContext(SessionContext);

  return (
    <div className={styles.component}>
      <div className={styles.baseGlass}>
        <DashboardSection title='Queue'>
          {session.queue.map((item, i) => (
            <QuestAnsTemplate
              historyQuest={false}
              key={i}
              item={item}
              user={session.users.find((user) => user._id === item.from)}
            />
          ))}
        </DashboardSection>

        {isHost ? <AnswerQuestion /> : <AskQuestion />}

        <DashboardSection title='History'>
          {session.history.map((item, i) => (
            <QuestAnsTemplate
              historyQuest={true}
              key={i}
              item={item}
              user={session.users.find((user) => user._id === item.from)}
            />
          ))}
          
          {/* Start : This part is hard coded for testing purposes, Exclude from deployment */}
          <QuestAnsTemplate
              historyQuest={true}
              key={123}
              item={{question:"My name is Aman and what is yours?", answer: "Hey Aman, I am Ben. This Project is gonna rock and people will love it."}}
              user={{username:"Aman",} }
            />
          {/* End : This part is hard code for testing purposes, Exclude from deployment */}

        </DashboardSection>
      </div>
    </div>
  );
}
