import { useState } from 'react';
import type { Task } from '@/api/types';
import { useUpdateTask } from '@/hooks/useUpdateTask';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import styles from './TaskItem.module.css';

interface Props {
  task: Task;
  onUpdate?: (updatedTask: Task) => void;
  isLoggedIn: boolean;
}

export const TaskItem = ({ task, onUpdate, isLoggedIn }: Props) => {
  const [text, setText] = useState(task.text);
  const [status, setStatus] = useState(task.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { updateTask } = useUpdateTask();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!onUpdate) return;

    setIsUpdating(true);
    setError(null);

    try {
      await updateTask(task.id, { text, status });
      onUpdate({ ...task, text, status, isEdited: true });
    } catch (error) {
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        await logout();
        navigate('/login');
      } else {
        setError('Не удалось сохранить изменения');
        console.error('Ошибка при сохранении:', error);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className={styles.taskCell}>
          <span>{task.username}</span>
        </div>
        <div className={styles.taskCell}>
          <span>{task.email}</span>
        </div>
        <div className={styles.taskCell}>
          <p>{task.text}</p>
        </div>
        <div className={styles.taskCell}>
          <span>
            {task.status ? 'выполнено' : 'не выполнено'}
            {task.isEdited && <span className={styles.editedMark}>(изменено)</span>}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.taskCell}>
        <span>{task.username}</span>
      </div>
      <div className={styles.taskCell}>
        <span>{task.email}</span>
      </div>
      <div className={styles.taskCell}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isUpdating}
          rows={3}
        />
        <div className={styles.controls}>
          <button className={styles.saveButton} onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? 'Сохранение...' : 'Сохранить'}
          </button>
          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
      <div className={styles.taskCell}>
        <label className={styles.statusLabel}>
          <input
            type="checkbox"
            className={styles.statusCheckbox}
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            disabled={isUpdating}
          />
          {status ? 'выполнено' : 'не выполнено'}
        </label>
        {task.isEdited && !isUpdating && (
          <span className={styles.editedMark}>(отредактировано администратором)</span>
        )}
      </div>
    </>
  );
};
