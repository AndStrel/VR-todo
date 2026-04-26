import {
  useState,
} from 'react';
import type {
  ChangeEvent,
  KeyboardEvent,
  SubmitEvent,
} from 'react';
import {
  FiEdit2,
  FiRotateCcw,
  FiSave,
  FiTrash2,
} from 'react-icons/fi';
import { Button } from '../../../../shared/ui/Button';
import { TextInput } from '../../../../shared/ui/TextInput';
import { TODO_TITLE_MAX_LENGTH } from '../../model/constants';
import type { Todo } from '../../model/types';
import styles from './TodoItem.module.scss';

type TodoItemProps = {
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (id: Todo['id']) => Promise<void>;
  onToggle: (todo: Todo) => Promise<void>;
  onUpdate: (id: Todo['id'], title: Todo['title']) => Promise<void>;
  todo: Todo;
};

export const TodoItem = (props: TodoItemProps) => {
  const {
    isDeleting,
    isUpdating,
    onDelete,
    onToggle,
    onUpdate,
    todo,
  } = props;
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const isBusy = isDeleting || isUpdating;
  const canSaveDraft = Boolean(draftTitle.trim()) && !isBusy;

  const handleEditStart = () => {
    setDraftTitle(todo.title);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setDraftTitle(todo.title);
    setIsEditing(false);
  };

  const handleDraftTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftTitle(event.currentTarget.value);
  };

  const handleEditSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
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
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleEditCancel();
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(todo.id);
    } catch {
      // Ошибку мутации обработаем отдельным UI-блоком.
    }
  };

  const handleToggle = async () => {
    try {
      await onToggle(todo);
    } catch {
      // Ошибку мутации обработаем отдельным UI-блоком.
    }
  };

  if (isEditing) {
    return (
      <li className={styles.todoItem}>
        <form className={styles.todoItem__editForm} onSubmit={handleEditSubmit}>
          <label className={styles.todoItem__editLabel}>
            <TextInput
              aria-label="Название задачи"
              autoFocus
              disabled={isBusy}
              maxLength={TODO_TITLE_MAX_LENGTH}
              onChange={handleDraftTitleChange}
              onKeyDown={handleEditKeyDown}
              onClear={() => setDraftTitle('')}
              value={draftTitle}
            />
          </label>
          <div className={styles.todoItem__actions}>
            <Button
              aria-label="Сохранить"
              disabled={!canSaveDraft}
              iconOnly
              loading={isUpdating}
              type="submit"
            >
              <FiSave aria-hidden="true" />
            </Button>
            <Button
              aria-label="Отменить"
              disabled={isBusy}
              iconOnly
              onClick={handleEditCancel}
              type="button"
            >
              <FiRotateCcw aria-hidden="true" />
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={styles.todoItem}>
      <label className={styles.todoItem__status}>
        <input
          aria-label="Выполнена"
          className={styles.todoItem__checkbox}
          checked={todo.completed}
          disabled={isBusy}
          onChange={handleToggle}
          type="checkbox"
        />
        <span className={styles.todoItem__title}>{todo.title}</span>
      </label>
      <div className={styles.todoItem__actions}>
        <Button
          aria-label="Редактировать"
          disabled={isBusy}
          iconOnly
          onClick={handleEditStart}
          type="button"
        >
          <FiEdit2 aria-hidden="true" />
        </Button>
        <Button
          aria-label="Удалить"
          iconOnly
          loading={isDeleting}
          onClick={handleDelete}
          type="button"
        >
          <FiTrash2 aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
};
