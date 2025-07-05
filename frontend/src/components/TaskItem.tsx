import type { Task } from '@/api/types';

export const TaskItem = ({ task }: { task: Task }) => {
  return (
    <li>
      <span>{task.username}</span>
      <span>{task.email}</span>
      <p>{task.text}</p>
      <strong>{task.status ? '✔' : '✘'}</strong>
    </li>
  );
};
