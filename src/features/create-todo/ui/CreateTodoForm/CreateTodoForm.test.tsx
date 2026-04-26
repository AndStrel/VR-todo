import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTodoForm } from './CreateTodoForm';

describe('CreateTodoForm', () => {
  it('отправляет название задачи без лишних пробелов', async () => {
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

  it('не отправляет пустое название задачи', async () => {
    const handleCreate = vi.fn().mockResolvedValue(undefined);
    render(<CreateTodoForm isSubmitting={false} onCreate={handleCreate} />);

    await userEvent.type(screen.getByLabelText('Название новой задачи'), '   ');

    const submitButton = screen.getByRole('button', { name: 'Добавить' });

    expect(submitButton).toBeDisabled();
    await userEvent.click(submitButton);

    expect(handleCreate).not.toHaveBeenCalled();
  });

  it('ограничивает длину названия новой задачи', () => {
    render(<CreateTodoForm isSubmitting={false} onCreate={vi.fn()} />);

    expect(screen.getByLabelText('Название новой задачи'))
      .toHaveAttribute('maxlength', '120');
  });

  it('очищает введенное название задачи', async () => {
    render(<CreateTodoForm isSubmitting={false} onCreate={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Название новой задачи'), 'Текст');
    await userEvent.click(screen.getByRole('button', { name: 'Очистить поле' }));

    expect(screen.getByLabelText('Название новой задачи')).toHaveValue('');
  });
});
