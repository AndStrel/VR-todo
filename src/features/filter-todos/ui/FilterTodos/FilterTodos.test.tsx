import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterTodos } from './FilterTodos';

describe('FilterTodos', () => {
  const counts = {
    active: 1,
    all: 2,
    completed: 1,
  };

  it('изменяет фильтр по статусу', async () => {
    const handleChange = vi.fn();

    render(<FilterTodos counts={counts} onChange={handleChange} value="all" />);

    await userEvent.selectOptions(
      screen.getByLabelText('Фильтр задач'),
      'completed',
    );

    expect(handleChange).toHaveBeenCalledWith('completed');
  });

  it('показывает счетчики задач в пунктах фильтра', () => {
    render(<FilterTodos counts={counts} onChange={vi.fn()} value="all" />);

    expect(screen.getByRole('option', { name: 'Все (2)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Активные (1)' }))
      .toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Выполненные (1)' }))
      .toBeInTheDocument();
  });
});
