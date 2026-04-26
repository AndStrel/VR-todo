import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  iconOnly?: boolean;
  loading?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {
    children,
    disabled,
    iconOnly,
    loading,
    type = 'button',
    ...buttonProps
  } = props;
  const isDisabled = disabled || loading;
  const className = [
    styles.button,
    iconOnly ? styles.button_iconOnly : null,
  ].filter(Boolean).join(' ');

  return (
    <button
      aria-busy={loading || undefined}
      className={className}
      disabled={isDisabled}
      type={type}
      {...buttonProps}
    >
      {loading ? (
        <span className={styles.button__dots}>
          <span className={styles.button__dot} />
          <span className={styles.button__dot} />
          <span className={styles.button__dot} />
        </span>
      ) : (
        children
      )}
    </button>
  );
};
