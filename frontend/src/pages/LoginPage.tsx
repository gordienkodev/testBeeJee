import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '@/hooks/useAuthCheck';

export function LoginPage() {
  useAuthCheck();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout, error, loading, isAuthenticated } = useAuthStore();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      setUsername('');
      setPassword('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUsername('');
    setPassword('');
  };

  const handleGoToList = () => {
    navigate('/');
  };

  return (
    <>
      <div className={styles.container}>
        {!isAuthenticated && (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Имя пользователя:</label>
              <input
                className={styles.input}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Пароль:</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        )}

        {isAuthenticated && (
          <button className={styles.button} onClick={handleLogout}>
            Выйти
          </button>
        )}
      </div>

      {error && (
        <div className={`${styles.message} ${styles.error}`}>Неправильные реквизиты доступа!</div>
      )}

      {isAuthenticated && (
        <div className={`${styles.message} ${styles.success}`}>Вы успешно вошли в систему!</div>
      )}

      <button className={styles.button} onClick={handleGoToList}>
        Перейти к списку задач
      </button>
    </>
  );
}
