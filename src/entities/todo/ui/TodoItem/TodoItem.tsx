import { memo } from 'react';
import type { Todo } from '../../model/types';
import styles from './TodoItem.module.scss';

type TodoItemProps = {
  todo: Todo;
};

export const TodoItem = memo((props: TodoItemProps) => {
  const { todo } = props;

  return <li className={styles.todoItem}>{todo.title}</li>;
});
