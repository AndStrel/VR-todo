import type { Todo } from '../../model/types';
import { TodoItem } from '../TodoItem';
import styles from './TodoList.module.scss';

type TodoListProps = {
  deletingTodoId: Todo['id'] | null;
  onDelete: (id: Todo['id']) => Promise<void>;
  onUpdate: (id: Todo['id'], title: Todo['title']) => Promise<void>;
  todos: Todo[];
  updatingTodoId: Todo['id'] | null;
};

export const TodoList = (props: TodoListProps) => {
  const {
    deletingTodoId,
    onDelete,
    onUpdate,
    todos,
    updatingTodoId,
  } = props;

  return (
    <ul className={styles.todoList}>
      {todos.map((todo) => (
        <TodoItem
          isDeleting={deletingTodoId === todo.id}
          isUpdating={updatingTodoId === todo.id}
          key={todo.id}
          onDelete={onDelete}
          onUpdate={onUpdate}
          todo={todo}
        />
      ))}
    </ul>
  );
};
