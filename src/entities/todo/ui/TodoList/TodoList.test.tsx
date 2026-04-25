import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import type { Todo } from '../../model/types';

const todo: Todo = {
  completed: false,
  createdAt: '2026-04-25T09:10:00.000Z',
  id: 1,
  title: 'Подключить локальный сервер задач',
  updatedAt: '2026-04-25T09:10:00.000Z',
};

describe('TodoList', () => {
  it('renders empty state when list is empty and text is provided', () => {
    render(
      <TodoList
        deletingTodoId={null}
        emptyText="ничего не найдено"
        onDelete={vi.fn()}
        onToggle={vi.fn()}
        onUpdate={vi.fn()}
        todos={[]}
        updatingTodoId={null}
      />,
    );

    expect(screen.getByText('ничего не найдено')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders todo items', () => {
    render(
      <TodoList
        deletingTodoId={null}
        onDelete={vi.fn()}
        onToggle={vi.fn()}
        onUpdate={vi.fn()}
        todos={[todo]}
        updatingTodoId={null}
      />,
    );

    expect(screen.getByText(todo.title)).toBeInTheDocument();
  });
});
