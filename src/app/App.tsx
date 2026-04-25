import { memo } from 'react';
import { TodoList, useTodos } from '../entities/todo';
import { CreateTodoForm } from '../features/create-todo';
import styles from './App.module.scss';

const AppComponent = () => {
  const {
    deletingTodoId,
    handleCreateTodo,
    handleDeleteTodo,
    handleUpdateTodo,
    isCreatePending,
    isError,
    isLoading,
    todos,
    updatingTodoId,
  } = useTodos();

  return (
    <main className={styles.app}>
      <section
        className={styles.app__contentPanel}
        aria-label="Панель управления задачами"
      >
        <h1 className={styles.app__title}>Панель задач</h1>
        <CreateTodoForm
          isSubmitting={isCreatePending}
          onCreate={handleCreateTodo}
        />
        {isLoading && (
          <p className={styles.app__status}>Загружаем задачи...</p>
        )}
        {isError && (
          <p className={styles.app__status}>Не удалось загрузить задачи</p>
        )}
        {!isLoading && !isError && (
          <TodoList
            deletingTodoId={deletingTodoId}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
            todos={todos}
            updatingTodoId={updatingTodoId}
          />
        )}
      </section>
    </main>
  );
};

export const App = memo(AppComponent);
