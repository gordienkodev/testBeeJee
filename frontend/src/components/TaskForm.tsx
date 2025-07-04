import { useState } from 'react';
import styles from './TaskForm.module.css';

type TaskFormProps = {
  onAdd: (task: { username: string; email: string; text: string }) => void;
};

export const TaskForm = ({ onAdd }: TaskFormProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !text) return;

    onAdd({ username, email, text });

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
      <button type="submit">Добавить</button>
    </form>
  );
};
