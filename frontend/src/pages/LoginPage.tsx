import { useState } from 'react';
import { useLogin } from '@/hooks/useLogin';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout, error, success, loading, isAuthenticated } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  const handleLogout = async () => {
    await logout();
    setUsername('');
    setPassword('');
  };

  const navigate = useNavigate();

  const handleGoToList = () => {
    navigate('/');
  };

  return (
    <>
      <div className={styles.container}>
        {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}
        {success && isAuthenticated ? (
          <>
            <div className={`${styles.message} ${styles.success}`}>Вы успешно вошли в систему!</div>
            <button className={styles.button} onClick={handleLogout}>
              Выйти
            </button>
          </>
        ) : (
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
      </div>

      <button className={styles.button} onClick={handleGoToList}>
        Перейти к списку задач
      </button>
    </>
  );
}
