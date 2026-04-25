import { ChangeEvent } from 'react';
import type { TodoStatusFilter } from '../../../../entities/todo';
import styles from './FilterTodos.module.scss';

type FilterTodosProps = {
  onChange: (statusFilter: TodoStatusFilter) => void;
  value: TodoStatusFilter;
};

export const FilterTodos = (props: FilterTodosProps) => {
  const { onChange, value } = props;

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
        <option value="all">Все</option>
        <option value="active">Активные</option>
        <option value="completed">Выполненные</option>
      </select>
    </label>
  );
};
