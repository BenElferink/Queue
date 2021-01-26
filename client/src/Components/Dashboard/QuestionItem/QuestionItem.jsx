import styles from './QuestionItem.module.css';

export default function QuestionItem({ item, user }) {
  return (
    <div>
      <span>{user.username}</span>
      <br />
      Q: {item.question}
    </div>
  );
}
