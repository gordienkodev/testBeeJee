import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Pagination } from './Pagination';
import { TaskItem } from './TaskItem';
import { useAuthStore } from '@/store/authStore';
import styles from './TaskList.module.css';

const DEFAULT_PAGE = 1;

export const TaskList = () => {
  const {
    data,
    loading,
    error,
    page,
    sortField,
    sortOrder,
    fetch,
    setPage,
    setSortField,
    toggleSortOrder,
    updateTaskInStore,
  } = useTaskStore();

  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    fetch();
  }, [page, sortField, sortOrder, fetch]);

  const onSortChange = (field: 'username' | 'email' | 'status') => {
    if (sortField === field) {
      toggleSortOrder();
    } else {
      setSortField(field);
    }
  };

  const handleUpdateTask = updateTaskInStore;

  if (loading) return <div className={styles.wrapper}>Загрузка...</div>;
  if (error) return <div className={styles.wrapper}>Ошибка: {error}</div>;
  if (!data) return null;

  return (
    <div className={styles.wrapper}>
      <ul className={styles.headerList}>
        <li className={styles.headerRow}>
          <div
            className={`${styles.headerItem} ${styles.sortableHeader}`}
            onClick={() => onSortChange('username')}
          >
            Имя {sortField === 'username' && (sortOrder === 'ASC' ? '▲' : '▼')}
          </div>
          <div
            className={`${styles.headerItem} ${styles.sortableHeader}`}
            onClick={() => onSortChange('email')}
          >
            Email {sortField === 'email' && (sortOrder === 'ASC' ? '▲' : '▼')}
          </div>
          <div className={styles.headerItem}>Задача</div>
          <div
            className={`${styles.headerItem} ${styles.sortableHeader}`}
            onClick={() => onSortChange('status')}
          >
            Статус {sortField === 'status' && (sortOrder === 'ASC' ? '▲' : '▼')}
          </div>
        </li>
      </ul>

      <ul className={styles.taskList}>
        {data.tasks.map((task) => (
          <li key={task.id} className={styles.taskRow}>
            <TaskItem task={task} onUpdate={handleUpdateTask} isLoggedIn={isLoggedIn} />
          </li>
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
