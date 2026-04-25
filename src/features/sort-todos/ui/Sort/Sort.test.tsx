import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sort } from './Sort';

describe('Sort', () => {
  it('изменяет режим сортировки', async () => {
    const handleChange = vi.fn();

    render(<Sort onChange={handleChange} value="newest" />);

    await userEvent.selectOptions(
      screen.getByLabelText('Сортировка задач'),
      'oldest',
    );

    expect(handleChange).toHaveBeenCalledWith('oldest');
  });
});
