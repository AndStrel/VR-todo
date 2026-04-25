import styles from './EmptyState.module.scss';

type EmptyStateProps = {
  text: string;
};

export const EmptyState = (props: EmptyStateProps) => {
  const { text } = props;

  return <p className={styles.emptyState}>{text}</p>;
};
