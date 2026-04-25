import { memo, useMemo } from 'react';
import type { Todo } from '../../model/types';
import { TodoItem } from '../TodoItem';
import styles from './TodoList.module.scss';

type TodoListProps = {
  todos: Todo[];
};

export const TodoList = memo((props: TodoListProps) => {
  const { todos } = props;
  const todoItems = useMemo(
    () => todos.map((todo) => <TodoItem key={todo.id} todo={todo} />),
    [todos],
  );

  return <ul className={styles.todoList}>{todoItems}</ul>;
});
