import type { InputHTMLAttributes } from 'react';
import styles from './TextInput.module.scss';

type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'type'
> & {
  onClear?: () => void;
};

export const TextInput = (props: TextInputProps) => {
  const {
    disabled,
    onClear,
    readOnly,
    value,
    ...inputProps
  } = props;
  const canClear = Boolean(value) && !disabled && !readOnly && onClear;

  return (
    <span className={styles.textInput}>
      <input
        className={styles.textInput__control}
        disabled={disabled}
        readOnly={readOnly}
        type="text"
        value={value}
        {...inputProps}
      />
      {canClear && (
        <button
          aria-label="Очистить поле"
          className={styles.textInput__clearButton}
          onClick={onClear}
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
};
