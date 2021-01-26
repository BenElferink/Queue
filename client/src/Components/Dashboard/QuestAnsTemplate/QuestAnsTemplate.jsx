import styles from './QuestAnsTemplate.module.css';
import Avatar from '@material-ui/core/Avatar';
import { useEffect, useRef } from 'react';

export default function QuestAnsTemplate({ item, user, historyQuest }) {

  const avatar = useRef();

  const avatarColor = () =>{
    let h = 0;
    for (var i = 0; i < user.username.length; i++) {
      h += user.username.length * user.username.charCodeAt(i) ;
    }
    const hsl = `hsl(${h+','+ 30 +'%,'+ 45 +'%'})`;
    avatar.current.style.backgroundColor = hsl;
    avatar.current.style.width = '35px';
    avatar.current.style.height = '35px';
  }
  useEffect(() => {
      avatarColor()
  })

  return(
    <div className={`${styles.component} ${historyQuest && styles.history}`}>
      <div>
        <Avatar ref={avatar}>{user.username[0]}</Avatar>
        <span>{user.username}</span>
      </div>
      <p>{item.question}</p> 
      
      {historyQuest? <p className={styles.answer}>{item.answer}</p> : null}
    </div>

  )

}
