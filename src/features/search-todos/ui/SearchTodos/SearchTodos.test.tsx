import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchTodos } from './SearchTodos';

describe('SearchTodos', () => {
  it('changes and clears search query', async () => {
    const handleChange = vi.fn();

    render(<SearchTodos onChange={handleChange} value="поиск" />);

    await userEvent.type(screen.getByLabelText('Поиск по задачам'), '1');
    await userEvent.click(screen.getByRole('button', { name: 'Очистить поле' }));

    expect(handleChange).toHaveBeenCalledWith('поиск1');
    expect(handleChange).toHaveBeenCalledWith('');
  });
});
