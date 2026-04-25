import type { InputHTMLAttributes } from 'react';
import styles from './TextInput.module.scss';

type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'type'
>;

export const TextInput = (props: TextInputProps) => {
  return (
    <input
      className={styles.textInput}
      type="text"
      {...props}
    />
  );
};
