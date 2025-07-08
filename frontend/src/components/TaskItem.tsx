import { useEffect } from 'react';
import type { Task } from '@/api/types';
import { useTaskStore } from '@/store/taskStore';
import { useUpdateTask } from '@/hooks/useUpdateTask';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import styles from './TaskItem.module.css';

interface Props {
  task: Task;
  isLoggedIn: boolean;
}

export const TaskItem = ({ task, isLoggedIn }: Props) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { updateTask } = useUpdateTask();

  const {
    initializeTaskEdit,
    updateTaskEditText,
    updateTaskEditStatus,
    saveTaskEdit,
    getTaskEditData,
  } = useTaskStore();

  useEffect(() => {
    if (isLoggedIn) {
      initializeTaskEdit(task.id, task);
    }
  }, [task.id, task.text, task.status, isLoggedIn, initializeTaskEdit]);

  const editData = getTaskEditData(task.id);

  const handleSave = async () => {
    const result = await saveTaskEdit(task.id, updateTask);

    if (result.unauthorized) {
      await logout();
      navigate('/login');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateTaskEditText(task.id, e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTaskEditStatus(task.id, e.target.checked);
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
          <p>{task.text} {task.isEdited && (
              <span className={styles.editedMark}>(отредактировано администратором)</span>
            )}</p>
        </div>
        <div className={styles.taskCell}>
          <span>
            {task.status ? 'выполнено' : 'не выполнено'}
            
          </span>
        </div>
      </>
    );
  }

  if (!editData) {
    return null;
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
          value={editData.text}
          onChange={handleTextChange}
          disabled={editData.isUpdating}
          rows={3}
        /> {task.isEdited && !editData.isUpdating && (
          <span className={styles.editedMark}>(отредактировано администратором)</span>
        )}
        <div className={styles.controls}>
          <button className={styles.saveButton} onClick={handleSave} disabled={editData.isUpdating}>
            {editData.isUpdating ? 'Сохранение...' : 'Сохранить'}
          </button>
          {editData.error && <div className={styles.error}>{editData.error}</div>}
        </div>
      </div>
      <div className={styles.taskCell}>
        <label className={styles.statusLabel}>
          <input
            type="checkbox"
            className={styles.statusCheckbox}
            checked={editData.status}
            onChange={handleStatusChange}
            disabled={editData.isUpdating}
          />
          {editData.status ? 'выполнено' : 'не выполнено'}
        </label>
        
      </div>
    </>
  );
};
