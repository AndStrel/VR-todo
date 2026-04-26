import { useState } from 'react';
import {
  getVisibleTodos,
  TodoList,
  type TodoSort,
  type TodoStatusFilter,
  useTodos,
} from '../entities/todo';
import { CreateTodoForm } from '../features/create-todo';
import { ThemeToggle } from '../features/theme-toggle';
import { TodoControls } from '../widgets/todo-controls';
import styles from './App.module.scss';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>('all');
  const [sort, setSort] = useState<TodoSort>('newest');
  const {
    deletingTodoId,
    handleCreateTodo,
    handleDeleteTodo,
    handleToggleTodo,
    handleUpdateTodo,
    isCreatePending,
    isError,
    isLoading,
    mutationErrorMessage,
    todos,
    updatingTodoId,
  } = useTodos();
  const visibleTodos = getVisibleTodos({
    searchQuery,
    sort,
    statusFilter,
    todos,
  });
  const hasEmptySearchResult = Boolean(searchQuery.trim()) &&
    visibleTodos.length === 0;

  return (
    <main className={styles.app}>
      <section
        className={styles.app__contentPanel}
        aria-label="Панель управления задачами"
      >
        <div className={styles.app__header}>
          <h1 className={styles.app__title}>Панель задач</h1>
          <ThemeToggle />
        </div>
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
        {mutationErrorMessage && (
          <p className={styles.app__status} role="alert">
            {mutationErrorMessage}
          </p>
        )}
        {!isLoading && !isError && (
          <>
            <TodoControls
              onSearchQueryChange={setSearchQuery}
              onSortChange={setSort}
              onStatusFilterChange={setStatusFilter}
              searchQuery={searchQuery}
              sort={sort}
              statusFilter={statusFilter}
              todos={todos}
            />
            <TodoList
              deletingTodoId={deletingTodoId}
              emptyText={hasEmptySearchResult ? 'ничего не найдено' : undefined}
              onDelete={handleDeleteTodo}
              onToggle={handleToggleTodo}
              onUpdate={handleUpdateTodo}
              todos={visibleTodos}
              updatingTodoId={updatingTodoId}
            />
          </>
        )}
      </section>
    </main>
  );
};
