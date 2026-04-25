import styles from './App.module.scss';

export function App() {
  return (
    <main className={styles.app}>
      <section
        className={styles.contentPanel}
        aria-label="Панель управления задачами"
      >
        <h1 className={styles.title}>Панель задач</h1>
      </section>
    </main>
  );
}
