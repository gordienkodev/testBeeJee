import { useAuthStore } from '@/store/authStore';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '@/hooks/useAuthCheck';

export function LoginPage() {
  useAuthCheck();

  const {
    username,
    password,
    validationError,
    login,
    logout,
    error,
    loading,
    isAuthenticated,
    setUsername,
    setPassword,
    setValidationError,
    clearCredentials,
  } = useAuthStore();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setValidationError('Поля обязательны для заполнения');
      return;
    }

    setValidationError('');
    const success = await login(username, password);
    if (success) {
      clearCredentials();
    }
  };

  const handleLogout = async () => {
    await logout();
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
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Пароль:</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

      {validationError && (
        <div className={`${styles.message} ${styles.error}`}>{validationError}</div>
      )}

      {!validationError && error && (
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
