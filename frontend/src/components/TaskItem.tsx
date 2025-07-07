import { useState } from 'react';
import type { Task } from '@/api/types';
import styles from './TaskItem.module.css';

interface Props {
  task: Task;
  onUpdate?: (updatedTask: Task) => void;
  isLoggedIn: boolean;
}

export const TaskItem = ({ task, onUpdate, isLoggedIn }: Props) => {
  const [text, setText] = useState(task.text);
  const [status, setStatus] = useState(task.status);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ ...task, text, status });
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
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <label>
          Статус:{' '}
          <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
        </label>
      </li>

      <div className={styles.taskItemControls}>
        <button className={styles.saveButton} onClick={handleSave}>
          Сохранить
        </button>

        {task.isEdited && <em className={styles.editedMark}>отредактировано администратором</em>}
      </div>
    </>
  );
};
