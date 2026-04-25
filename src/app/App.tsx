import { memo, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTodo, getTodos } from '../entities/todo';
import { TodoList } from '../entities/todo';
import { CreateTodoForm } from '../features/create-todo';
import styles from './App.module.scss';

const AppComponent = () => {
  const queryClient = useQueryClient();
  const {
    data: todos = [],
    isError,
    isLoading,
  } = useQuery({
    queryFn: getTodos,
    queryKey: ['todos'],
  });

  const {
    isPending: isCreatePending,
    mutateAsync: createTodoMutateAsync,
  } = useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleCreateTodo = useCallback(
    async (title: string) => {
      const createdAt = new Date().toISOString();

      await createTodoMutateAsync({
        completed: false,
        createdAt,
        title,
        updatedAt: createdAt,
      });
    },
    [createTodoMutateAsync],
  );

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
        {!isLoading && !isError && <TodoList todos={todos} />}
      </section>
    </main>
  );
};

export const App = memo(AppComponent);
