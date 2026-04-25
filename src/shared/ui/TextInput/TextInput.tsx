import { InputHTMLAttributes, memo } from 'react';
import styles from './TextInput.module.scss';

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const TextInput = memo((props: TextInputProps) => {
  const { className, ...inputProps } = props;
  const inputClassName = className
    ? `${styles.textInput} ${className}`
    : styles.textInput;

  return (
    <input
      className={inputClassName}
      type="text"
      {...inputProps}
    />
  );
});
