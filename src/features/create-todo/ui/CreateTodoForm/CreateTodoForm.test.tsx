import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTodoForm } from './CreateTodoForm';

describe('CreateTodoForm', () => {
  it('submits trimmed task title', async () => {
    const handleCreate = vi.fn().mockResolvedValue(undefined);
    render(<CreateTodoForm isSubmitting={false} onCreate={handleCreate} />);

    await userEvent.type(
      screen.getByLabelText('Название новой задачи'),
      '  Новая задача  ',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(handleCreate).toHaveBeenCalledWith('Новая задача');
    expect(screen.getByLabelText('Название новой задачи')).toHaveValue('');
  });

  it('does not submit empty task title', async () => {
    const handleCreate = vi.fn().mockResolvedValue(undefined);
    render(<CreateTodoForm isSubmitting={false} onCreate={handleCreate} />);

    await userEvent.type(screen.getByLabelText('Название новой задачи'), '   ');
    await userEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(handleCreate).not.toHaveBeenCalled();
  });

  it('limits new task title length', () => {
    render(<CreateTodoForm isSubmitting={false} onCreate={vi.fn()} />);

    expect(screen.getByLabelText('Название новой задачи'))
      .toHaveAttribute('maxlength', '120');
  });

  it('clears entered task title', async () => {
    render(<CreateTodoForm isSubmitting={false} onCreate={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Название новой задачи'), 'Текст');
    await userEvent.click(screen.getByRole('button', { name: 'Очистить поле' }));

    expect(screen.getByLabelText('Название новой задачи')).toHaveValue('');
  });
});
