import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Pagination } from './Pagination';
import { TaskItem } from './TaskItem';
import type { Task } from '@/api/types';
import styles from './TaskList.module.css';
import { useUpdateTask } from '@/hooks/useUpdateTask';
import { useAuthStore } from '@/store/authStore';

const DEFAULT_PAGE = 1;

export const TaskList = () => {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'username' | 'email' | 'status'>('username');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  const { data, loading, error } = useTasks({ page, sortField, sortOrder });

  const onSortChange = (field: 'username' | 'email' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  const updateTaskObj = useUpdateTask();

  const handleUpdateTask = (task: Task) => {
    updateTaskObj.updateTask(task.id, { text: task.text, status: task.status });
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!data) return null;

  return (
    <div className={styles.wrapper}>
      <ul className={styles.headerList}>
        <li className={styles.headerListItem}>
          <div className={styles.sortableHeader} onClick={() => onSortChange('username')}>
            Имя {sortField === 'username' ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
          </div>
          <div className={styles.sortableHeader} onClick={() => onSortChange('email')}>
            Email {sortField === 'email' ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
          </div>
          <span>Задача</span>
          <div className={styles.sortableHeader} onClick={() => onSortChange('status')}>
            Статус {sortField === 'status' ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
          </div>
        </li>
      </ul>

      <ul className={styles.taskList}>
        {data.tasks.map((task) => (
          <TaskItem key={task.id} task={task} onUpdate={handleUpdateTask} isLoggedIn={isLoggedIn} />
        ))}
      </ul>

      {data.totalPages > DEFAULT_PAGE && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          hasPrev={data.hasPrev}
          hasNext={data.hasNext}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
