import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { Button } from '../../../../shared/ui/Button';

export type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'todo-list-theme';

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return savedTheme === 'dark' ? 'dark' : 'light';
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <Button
      aria-label={nextTheme === 'dark' ? 'Темная тема' : 'Светлая тема'}
      iconOnly
      onClick={() => setTheme(nextTheme)}
      type="button"
    >
      {nextTheme === 'dark' ? (
        <FiMoon aria-hidden="true" />
      ) : (
        <FiSun aria-hidden="true" />
      )}
    </Button>
  );
};
