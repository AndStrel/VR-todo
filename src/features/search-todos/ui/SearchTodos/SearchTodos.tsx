import type { ChangeEvent } from 'react';
import { TextInput } from '../../../../shared/ui/TextInput';
import styles from './SearchTodos.module.scss';

type SearchTodosProps = {
  onChange: (searchQuery: string) => void;
  value: string;
};

export const SearchTodos = (props: SearchTodosProps) => {
  const { onChange, value } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
  };

  return (
    <label className={styles.searchTodos}>
      <span className={styles.searchTodos__labelText}>Поиск по задачам</span>
      <TextInput
        onChange={handleChange}
        onClear={() => onChange('')}
        placeholder="Найти задачу"
        value={value}
      />
    </label>
  );
};
