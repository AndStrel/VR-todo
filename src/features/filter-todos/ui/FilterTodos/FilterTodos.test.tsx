import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterTodos } from './FilterTodos';

describe('FilterTodos', () => {
  it('изменяет фильтр по статусу', async () => {
    const handleChange = vi.fn();

    render(<FilterTodos onChange={handleChange} value="all" />);

    await userEvent.selectOptions(
      screen.getByLabelText('Фильтр задач'),
      'completed',
    );

    expect(handleChange).toHaveBeenCalledWith('completed');
  });
});
