import type { Task } from '@/api/types';
import styles from './TaskItem.module.css';

export const TaskItem = ({ task }: { task: Task }) => {
  return (
    <li className={styles.item}>
      <span>{task.username}</span>
      <span>{task.email}</span>
      <p>{task.text}</p>
      <strong>{task.status ? '✔' : '✘'}</strong>
    </li>
  );
};
