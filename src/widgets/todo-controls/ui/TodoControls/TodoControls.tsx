import type { Todo, TodoSort, TodoStatusFilter } from '../../../../entities/todo';
import { FilterTodos } from '../../../../features/filter-todos';
import { SearchTodos } from '../../../../features/search-todos';
import { Sort } from '../../../../features/sort-todos';
import styles from './TodoControls.module.scss';

type TodoControlsProps = {
  onSearchQueryChange: (searchQuery: string) => void;
  onSortChange: (sort: TodoSort) => void;
  onStatusFilterChange: (statusFilter: TodoStatusFilter) => void;
  searchQuery: string;
  sort: TodoSort;
  statusFilter: TodoStatusFilter;
  todos: Todo[];
};

export const TodoControls = (props: TodoControlsProps) => {
  const {
    onSearchQueryChange,
    onSortChange,
    onStatusFilterChange,
    searchQuery,
    sort,
    statusFilter,
    todos,
  } = props;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const counts = {
    active: todos.length - completedCount,
    all: todos.length,
    completed: completedCount,
  };

  return (
    <div className={styles.todoControls}>
      <SearchTodos onChange={onSearchQueryChange} value={searchQuery} />
      <FilterTodos
        counts={counts}
        onChange={onStatusFilterChange}
        value={statusFilter}
      />
      <Sort onChange={onSortChange} value={sort} />
    </div>
  );
};
