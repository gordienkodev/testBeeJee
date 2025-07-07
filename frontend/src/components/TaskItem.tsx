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
      <li>
        <span>{task.username}</span>
        <span>{task.email}</span>
        <p>{task.text}</p>
        {task.status ? 'выполнено' : 'не выполнено'} <br />
        {task.isEdited && <em className={styles.editedMark}>отредактировано администратором</em>}
      </li>
    );
  }

  return (
    <>
      <li>
        <span>{task.username}</span>
        <span>{task.email}</span>
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          disabled={isUpdating}
        />
        <label>
          Статус:{' '}
          <input 
            type="checkbox" 
            checked={status} 
            onChange={(e) => setStatus(e.target.checked)}
            disabled={isUpdating}
          />
        </label>
      </li>

      <div className={styles.taskItemControls}>
        <button 
          className={styles.saveButton} 
          onClick={handleSave}
          disabled={isUpdating}
        >
          {isUpdating ? 'Сохранение...' : 'Сохранить'}
        </button>
        
        {error && <span className={styles.error}>{error}</span>}
        {task.isEdited && <em className={styles.editedMark}>отредактировано администратором</em>}
      </div>
    </>
  );
};