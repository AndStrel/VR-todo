import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders loading state and disables button', () => {
    render(<Button loading>Добавить</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByText('Добавить')).not.toBeInTheDocument();
  });
});
