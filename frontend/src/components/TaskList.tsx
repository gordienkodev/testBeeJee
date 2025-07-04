import { useState } from 'react';
import styles from './TaskList.module.css';
import { useTasks } from '@/hooks/useTasks';
import { Pagination } from './Pagination';
import { TaskItem } from './TaskItem'; 

export const TaskList = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useTasks(page);


  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!data) return null;

  return (
    <div className={styles.wrapper}>
     

      <ul className={styles.headerList}>
        <li>
          <span>Имя</span>
          <span>Email</span>
          <span>Задача</span>
          <span>Статус</span>
        </li>
      </ul>

      <ul className={styles.taskList}>
        {data.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>

      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        hasPrev={data.hasPrev}
        hasNext={data.hasNext}
        onPageChange={setPage}
      />
    </div>
  );
};
