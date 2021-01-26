import styles from './HistoryItem.module.css';

export default function HistoryItem({ item, user }) {
  return (
  <div>
    <span>{user.username}</span>
    <br />
    Q: {item.question} <br />
    A: {item.answer}
  </div>
);
}
