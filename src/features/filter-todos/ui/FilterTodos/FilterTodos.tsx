import { ChangeEvent } from 'react';
import type { TodoStatusFilter } from '../../../../entities/todo';
import styles from './FilterTodos.module.scss';

type FilterTodosProps = {
  counts: Record<TodoStatusFilter, number>;
  onChange: (statusFilter: TodoStatusFilter) => void;
  value: TodoStatusFilter;
};

export const FilterTodos = (props: FilterTodosProps) => {
  const { counts, onChange, value } = props;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.currentTarget.value as TodoStatusFilter);
  };

  return (
    <label className={styles.filterTodos}>
      <span className={styles.filterTodos__labelText}>Фильтр задач</span>
      <select
        className={styles.filterTodos__select}
        onChange={handleChange}
        value={value}
      >
        <option value="all">Все ({counts.all})</option>
        <option value="active">Активные ({counts.active})</option>
        <option value="completed">Выполненные ({counts.completed})</option>
      </select>
    </label>
  );
};
