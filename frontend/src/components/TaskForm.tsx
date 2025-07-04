import { useState } from 'react';
import styles from './TaskForm.module.css';
import { useCreateTask } from '@/hooks/useCreateTask';

export const TaskForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const { createTask, loading, error } = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !text) return;

    await createTask({ username, email, text });

    setUsername('');
    setEmail('');
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Имя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <textarea
        placeholder="Задача"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        Добавить
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};
