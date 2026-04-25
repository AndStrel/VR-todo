import { ChangeEvent } from 'react';
import type { TodoSort } from '../../../../entities/todo';
import styles from './Sort.module.scss';

type SortProps = {
  onChange: (sort: TodoSort) => void;
  value: TodoSort;
};

export const Sort = (props: SortProps) => {
  const { onChange, value } = props;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.currentTarget.value as TodoSort);
  };

  return (
    <label className={styles.sort}>
      <span className={styles.sort__labelText}>Сортировка задач</span>
      <select
        className={styles.sort__select}
        onChange={handleChange}
        value={value}
      >
        <option value="newest">Сначала новые</option>
        <option value="oldest">Сначала старые</option>
        <option value="active-first">Активные сначала</option>
        <option value="completed-first">Выполненные сначала</option>
      </select>
    </label>
  );
};
