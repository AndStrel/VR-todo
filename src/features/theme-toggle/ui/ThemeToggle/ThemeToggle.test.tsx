import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('переключает тему и сохраняет выбранный режим', async () => {
    render(<ThemeToggle />);

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await userEvent.click(screen.getByRole('button', { name: 'Темная тема' }));

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('todo-list-theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Светлая тема' }))
      .toBeInTheDocument();
  });

  it('использует сохраненную тему при запуске', () => {
    localStorage.setItem('todo-list-theme', 'dark');

    render(<ThemeToggle />);

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('button', { name: 'Светлая тема' }))
      .toBeInTheDocument();
  });
});
