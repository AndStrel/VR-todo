import styles from './ThemeToggle.module.scss';

export type ThemeMode = 'dark' | 'light';

type ThemeToggleProps = {
  onChange: (theme: ThemeMode) => void;
  value: ThemeMode;
};

export const ThemeToggle = (props: ThemeToggleProps) => {
  const { onChange, value } = props;
  const nextTheme = value === 'light' ? 'dark' : 'light';

  return (
    <button
      aria-label={nextTheme === 'dark' ? 'Темная тема' : 'Светлая тема'}
      className={styles.themeToggle}
      onClick={() => onChange(nextTheme)}
      type="button"
    >
      {nextTheme === 'dark' ? 'Темная тема' : 'Светлая тема'}
    </button>
  );
};
