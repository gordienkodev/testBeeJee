import { useState, useEffect } from 'react';
import styles from './TaskForm.module.css';
import { useTaskStore } from '@/store/taskStore';

export const TaskForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<{ username?: string; email?: string; text?: string }>({});

  const { createTaskInStore, loading, error, success, clearSuccess } = useTaskStore();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        clearSuccess();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, clearSuccess]);

  const removeError = (field: keyof typeof errors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = 'Имя обязательно';
    if (!email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email не валиден';
    }
    if (!text.trim()) newErrors.text = 'Текст задачи обязателен';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await createTaskInStore({
      username,
      email,
      text,
      status: false,
      isEdited: false,
    });

    setUsername('');
    setEmail('');
    setText('');
    setErrors({});
  };

  const handleUsernameBlur = () => {
    if (!username.trim()) {
      setErrors((prev) => ({ ...prev, username: 'Имя обязательно' }));
    } else {
      removeError('username');
    }
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: 'Email обязателен' }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Email не валиден' }));
    } else {
      removeError('email');
    }
  };

  const handleTextBlur = () => {
    if (!text.trim()) {
      setErrors((prev) => ({ ...prev, text: 'Текст задачи обязателен' }));
    } else {
      removeError('text');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Имя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={handleUsernameBlur}
          />
          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <textarea
            placeholder="Задача"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleTextBlur}
          />
          {errors.text && <p className={styles.error}>{errors.text}</p>}
        </div>

        <button type="submit" disabled={loading}>
          Добавить
        </button>
      </form>

      {success && <p className={styles.success}>Задача успешно добавлена!</p>}

      {error && <p className={styles.formError}>{error}</p>}
    </>
  );
};