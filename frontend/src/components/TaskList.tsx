import { useState } from 'react';
import styles from './TaskList.module.css';
import { useTasks } from '@/hooks/useTasks';
import { Pagination } from './Pagination';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'username' | 'email' | 'status'>('username');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

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

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!data) return null;

  return (
    <div className={styles.wrapper}>
      <ul className={styles.headerList}>
        <li style={{ display: 'flex', gap: '1rem' }}>
          <div
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => onSortChange('username')}
          >
            Имя {sortField === 'username' ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
          </div>
          <div
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => onSortChange('email')}
          >
            Email {sortField === 'email' ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
          </div>
          <span>Задача</span>
          <div
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => onSortChange('status')}
          >
            Статус {sortField === 'status' ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
          </div>
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
