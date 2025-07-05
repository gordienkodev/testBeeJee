import { useState } from 'react';
import { useLogin } from '@/hooks/useLogin';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout, error, success, loading, isAuthenticated } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginSuccess = await login(username, password);
    if (loginSuccess) {
      console.log('Успешный вход');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h1>Вход</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && isAuthenticated ? (
        <div>
          <div style={{ color: 'green' }}>Вы успешно вошли в систему!</div>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Имя пользователя:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Пароль:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      )}
    </div>
  );
}
