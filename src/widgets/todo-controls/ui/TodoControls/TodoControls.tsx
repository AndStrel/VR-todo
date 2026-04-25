import type { TodoSort, TodoStatusFilter } from '../../../../entities/todo';
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
};

export const TodoControls = (props: TodoControlsProps) => {
  const {
    onSearchQueryChange,
    onSortChange,
    onStatusFilterChange,
    searchQuery,
    sort,
    statusFilter,
  } = props;

  return (
    <div className={styles.todoControls}>
      <SearchTodos onChange={onSearchQueryChange} value={searchQuery} />
      <FilterTodos onChange={onStatusFilterChange} value={statusFilter} />
      <Sort onChange={onSortChange} value={sort} />
    </div>
  );
};
