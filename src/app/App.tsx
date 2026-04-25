import { ChangeEvent, useEffect, useState } from 'react';
import {
  getVisibleTodos,
  TodoList,
  type TodoSort,
  type TodoStatusFilter,
  useTodos,
} from '../entities/todo';
import { CreateTodoForm } from '../features/create-todo';
import { Sort } from '../features/sort-todos';
import { ThemeToggle, type ThemeMode } from '../features/theme-toggle';
import { TextInput } from '../shared/ui/TextInput';
import styles from './App.module.scss';

const THEME_STORAGE_KEY = 'todo-list-theme';

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return savedTheme === 'dark' ? 'dark' : 'light';
};

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>('all');
  const [sort, setSort] = useState<TodoSort>('newest');
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const {
    deletingTodoId,
    handleCreateTodo,
    handleDeleteTodo,
    handleToggleTodo,
    handleUpdateTodo,
    isCreatePending,
    isError,
    isLoading,
    todos,
    updatingTodoId,
  } = useTodos();
  const visibleTodos = getVisibleTodos({
    searchQuery,
    sort,
    statusFilter,
    todos,
  });
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <main className={styles.app}>
      <section
        className={styles.app__contentPanel}
        aria-label="Панель управления задачами"
      >
        <div className={styles.app__header}>
          <h1 className={styles.app__title}>Панель задач</h1>
          <ThemeToggle onChange={setTheme} value={theme} />
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
        {!isLoading && !isError && (
          <>
            <div className={styles.app__controls}>
              <label className={styles.app__controlLabel}>
                <span className={styles.app__controlLabelText}>
                  Поиск по задачам
                </span>
                <TextInput
                  onChange={handleSearchQueryChange}
                  placeholder="Найти задачу"
                  value={searchQuery}
                />
              </label>
              <div
                className={styles.app__filterGroup}
                aria-label="Фильтр задач"
              >
                <button
                  className={styles.app__filterButton}
                  disabled={statusFilter === 'all'}
                  onClick={() => setStatusFilter('all')}
                  type="button"
                >
                  Все
                </button>
                <button
                  className={styles.app__filterButton}
                  disabled={statusFilter === 'active'}
                  onClick={() => setStatusFilter('active')}
                  type="button"
                >
                  Активные
                </button>
                <button
                  className={styles.app__filterButton}
                  disabled={statusFilter === 'completed'}
                  onClick={() => setStatusFilter('completed')}
                  type="button"
                >
                  Выполненные
                </button>
              </div>
              <Sort onChange={setSort} value={sort} />
            </div>
            <TodoList
              deletingTodoId={deletingTodoId}
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
