import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.about} id='aboutQueue'>
      <h1>What is Queue?</h1>
      <p>
        In the modern scenario of teaching and education, due to the pandemic, teachers and mentors
        have been facing major issues of concern with respect to the productivity of their teaching
        sessions because of the irregular and poorly managed Questions (Doubts) and Answers
        (Solutions) asked in between the "online" sessions. Queue provides the host with various
        features that help them to manage and organize the session into various productive parts in
        a way that increases the amount of knowledge shared by the host as well as the number of
        doubts cleared.
      </p>
    </div>
  );
}
