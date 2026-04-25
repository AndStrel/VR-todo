import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  loading?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {
    children,
    disabled,
    loading,
    type = 'button',
    ...buttonProps
  } = props;
  const isDisabled = disabled || loading;

  return (
    <button
      className={styles.button}
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
