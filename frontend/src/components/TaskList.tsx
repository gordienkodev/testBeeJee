import styles from './TaskList.module.css';
import { TaskItem } from './TaskItem';
import { useTasks } from '@/hooks/useTasks';

export function TaskList() {
  const { tasks, loading, error } = useTasks(1);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки</p>;

  return (
    <>
      <ul className={styles.headerList}>
        <li>
          <span>Имя пользователя</span>
          <span>Email</span>
          <span>Текст задачи</span>
          <span>Статус</span>
        </li>
      </ul>
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </>
  );
}
