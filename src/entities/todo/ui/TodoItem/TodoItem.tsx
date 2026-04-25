import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button } from '../../../../shared/ui/Button';
import { TextInput } from '../../../../shared/ui/TextInput';
import type { Todo } from '../../model/types';
import styles from './TodoItem.module.scss';

const TODO_TITLE_MAX_LENGTH = 120;

type TodoItemProps = {
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (id: Todo['id']) => Promise<void>;
  onUpdate: (id: Todo['id'], title: Todo['title']) => Promise<void>;
  todo: Todo;
};

export const TodoItem = memo((props: TodoItemProps) => {
  const {
    isDeleting,
    isUpdating,
    onDelete,
    onUpdate,
    todo,
  } = props;
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const isBusy = isDeleting || isUpdating;

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(todo.title);
    }
  }, [isEditing, todo.title]);

  const handleEditStart = useCallback(() => {
    setDraftTitle(todo.title);
    setIsEditing(true);
  }, [todo.title]);

  const handleEditCancel = useCallback(() => {
    setDraftTitle(todo.title);
    setIsEditing(false);
  }, [todo.title]);

  const handleDraftTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setDraftTitle(event.currentTarget.value);
    },
    [],
  );

  const handleEditSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedTitle = draftTitle.trim();

      if (!trimmedTitle) {
        return;
      }

      if (trimmedTitle === todo.title) {
        setDraftTitle(todo.title);
        setIsEditing(false);

        return;
      }

      try {
        await onUpdate(todo.id, trimmedTitle);
        setIsEditing(false);
      } catch {
        // Ошибку мутации обработаем отдельным UI-блоком.
      }
    },
    [draftTitle, onUpdate, todo.id, todo.title],
  );

  const handleEditKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleEditCancel();
      }
    },
    [handleEditCancel],
  );

  const handleDelete = useCallback(async () => {
    try {
      await onDelete(todo.id);
    } catch {
      // Ошибку мутации обработаем отдельным UI-блоком.
    }
  }, [onDelete, todo.id]);

  if (isEditing) {
    return (
      <li className={styles.todoItem}>
        <form className={styles.todoItem__editForm} onSubmit={handleEditSubmit}>
          <label className={styles.todoItem__editLabel}>
            <span className={styles.todoItem__editLabelText}>
              Название задачи
            </span>
            <TextInput
              autoFocus
              disabled={isBusy}
              maxLength={TODO_TITLE_MAX_LENGTH}
              onChange={handleDraftTitleChange}
              onKeyDown={handleEditKeyDown}
              value={draftTitle}
            />
          </label>
          <div className={styles.todoItem__actions}>
            <Button loading={isUpdating} type="submit">
              Сохранить
            </Button>
            <Button
              disabled={isBusy}
              onClick={handleEditCancel}
              type="button"
            >
              Отменить
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={styles.todoItem}>
      <span className={styles.todoItem__title}>{todo.title}</span>
      <div className={styles.todoItem__actions}>
        <Button disabled={isBusy} onClick={handleEditStart} type="button">
          Редактировать
        </Button>
        <Button loading={isDeleting} onClick={handleDelete} type="button">
          Удалить
        </Button>
      </div>
    </li>
  );
});
