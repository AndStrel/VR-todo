import { ChangeEvent, SubmitEvent, useState } from 'react';
import { Button } from '../../../../shared/ui/Button';
import { TextInput } from '../../../../shared/ui/TextInput';
import styles from './CreateTodoForm.module.scss';

const TODO_TITLE_MAX_LENGTH = 120;

type CreateTodoFormProps = {
  isSubmitting: boolean;
  onCreate: (title: string) => Promise<void>;
};

export const CreateTodoForm = (props: CreateTodoFormProps) => {
  const { isSubmitting, onCreate } = props;
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    try {
      await onCreate(trimmedTitle);
      setTitle('');
    } catch {
      // Ошибку мутации обработаем отдельным UI-блоком.
    }
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };

  return (
    <form className={styles.createTodoForm} onSubmit={handleSubmit}>
      <label className={styles.createTodoForm__label}>
        <span className={styles.createTodoForm__labelText}>
          Название новой задачи
        </span>
        <TextInput
          maxLength={TODO_TITLE_MAX_LENGTH}
          onChange={handleTitleChange}
          onClear={() => setTitle('')}
          placeholder="Что нужно сделать?"
          value={title}
        />
      </label>
      <Button loading={isSubmitting} type="submit">
        Добавить
      </Button>
    </form>
  );
};
