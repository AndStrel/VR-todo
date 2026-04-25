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
  it('submits trimmed edited title', async () => {
    const props = renderTodoItem();

    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
    await userEvent.clear(screen.getByLabelText('Название задачи'));
    await userEvent.type(
      screen.getByLabelText('Название задачи'),
      '  Обновленная задача  {Enter}',
    );

    expect(props.onUpdate).toHaveBeenCalledWith(todo.id, 'Обновленная задача');
  });

  it('cancels editing with Escape', async () => {
    const props = renderTodoItem();

    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
    await userEvent.clear(screen.getByLabelText('Название задачи'));
    await userEvent.type(screen.getByLabelText('Название задачи'), 'Черновик');
    await userEvent.keyboard('{Escape}');

    expect(screen.getByText(todo.title)).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Черновик')).not.toBeInTheDocument();
    expect(props.onUpdate).not.toHaveBeenCalled();
  });

  it('does not submit empty edited title', async () => {
    const props = renderTodoItem();

    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
    await userEvent.clear(screen.getByLabelText('Название задачи'));
    await userEvent.type(screen.getByLabelText('Название задачи'), '   {Enter}');

    expect(screen.getByLabelText('Название задачи')).toHaveValue('   ');
    expect(props.onUpdate).not.toHaveBeenCalled();
  });

  it('clears edited title', async () => {
    renderTodoItem();

    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
    await userEvent.click(screen.getByRole('button', { name: 'Очистить поле' }));

    expect(screen.getByLabelText('Название задачи')).toHaveValue('');
  });

  it('calls delete handler', async () => {
    const props = renderTodoItem();

    await userEvent.click(screen.getByRole('button', { name: 'Удалить' }));

    expect(props.onDelete).toHaveBeenCalledWith(todo.id);
  });

  it('calls toggle handler', async () => {
    const props = renderTodoItem();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Выполнена' }));

    expect(props.onToggle).toHaveBeenCalledWith(props.todo);
  });
});
