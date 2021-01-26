import styles from './DashboardSection.module.css';

export default function DashboardSection({ children, title }) {
  return (
    <div className={styles.component}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
}
