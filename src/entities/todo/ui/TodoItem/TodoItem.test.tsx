import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import type { Todo } from '../../model/types';

const todo: Todo = {
  completed: false,
  createdAt: '2026-04-25T09:10:00.000Z',
  id: 1,
  title: 'Подключить локальный сервер задач',
  updatedAt: '2026-04-25T09:10:00.000Z',
};

const renderTodoItem = (todoOverride: Partial<Todo> = {}) => {
  const props = {
    isDeleting: false,
    isUpdating: false,
    onDelete: vi.fn().mockResolvedValue(undefined),
    onToggle: vi.fn().mockResolvedValue(undefined),
    onUpdate: vi.fn().mockResolvedValue(undefined),
    todo: {
      ...todo,
      ...todoOverride,
    },
  };

  render(<TodoItem {...props} />);

  return props;
};

describe('TodoItem', () => {
  it('отправляет отредактированное название без лишних пробелов', async () => {
    const props = renderTodoItem();

    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
    await userEvent.clear(screen.getByLabelText('Название задачи'));
    await userEvent.type(
      screen.getByLabelText('Название задачи'),
      '  Обновленная задача  {Enter}',
    );

    expect(props.onUpdate).toHaveBeenCalledWith(todo.id, 'Обновленная задача');
  });

  it('отменяет редактирование по Escape', async () => {
    const props = renderTodoItem();

    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
    await userEvent.clear(screen.getByLabelText('Название задачи'));
    await userEvent.type(screen.getByLabelText('Название задачи'), 'Черновик');
    await userEvent.keyboard('{Escape}');

    expect(screen.getByText(todo.title)).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Черновик')).not.toBeInTheDocument();
    expect(props.onUpdate).not.toHaveBeenCalled();
  });

  it('не отправляет пустое отредактированное название', async () => {
    const props = renderTodoItem();

    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
    await userEvent.clear(screen.getByLabelText('Название задачи'));
    await userEvent.type(screen.getByLabelText('Название задачи'), '   {Enter}');

    expect(screen.getByLabelText('Название задачи')).toHaveValue('   ');
    expect(props.onUpdate).not.toHaveBeenCalled();
  });

  it('очищает редактируемое название', async () => {
    renderTodoItem();

    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
    await userEvent.click(screen.getByRole('button', { name: 'Очистить поле' }));

    expect(screen.getByLabelText('Название задачи')).toHaveValue('');
  });

  it('вызывает обработчик удаления', async () => {
    const props = renderTodoItem();

    await userEvent.click(screen.getByRole('button', { name: 'Удалить' }));

    expect(props.onDelete).toHaveBeenCalledWith(todo.id);
  });

  it('вызывает обработчик переключения статуса', async () => {
    const props = renderTodoItem();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Выполнена' }));

    expect(props.onToggle).toHaveBeenCalledWith(props.todo);
  });

  it('показывает пользовательское название как обычный текст', () => {
    renderTodoItem({
      title: '<img src=x onerror=alert(1)>',
    });

    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
