import { useQuery } from '@tanstack/react-query';
import { getTodos } from '../entities/todo';
import styles from './App.module.scss';

export function App() {
  const {
    data: todos = [],
    isError,
    isLoading,
  } = useQuery({
    queryFn: getTodos,
    queryKey: ['todos'],
  });

  return (
    <main className={styles.app}>
      <section
        className={styles.contentPanel}
        aria-label="Панель управления задачами"
      >
        <h1 className={styles.title}>Панель задач</h1>
        {isLoading && <p className={styles.status}>Загружаем задачи...</p>}
        {isError && (
          <p className={styles.status}>Не удалось загрузить задачи</p>
        )}
        {!isLoading && !isError && (
          <ul className={styles.todoList}>
            {todos.map((todo) => (
              <li className={styles.todoItem} key={todo.id}>
                {todo.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
