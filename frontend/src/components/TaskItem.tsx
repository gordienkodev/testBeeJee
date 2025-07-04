import type { Task } from '@/api/types';

export function TaskItem({ task }: { task: Task }) {
  return (
    <li>
      <strong>{task.username}</strong> — {task.email}
      <p>{task.text}</p>
      <span>{task.completed ? 'Выполнено' : 'Не выполнено'}</span>
    </li>
  );
}
