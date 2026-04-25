import { ButtonHTMLAttributes, memo } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button = memo((props: ButtonProps) => {
  const {
    children,
    className,
    disabled,
    loading,
    type = 'button',
    ...buttonProps
  } = props;
  const isDisabled = disabled || loading;
  const buttonClassName = className
    ? `${styles.button} ${className}`
    : styles.button;

  return (
    <button
      className={buttonClassName}
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
});
