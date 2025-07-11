import { TaskList } from '../components/TaskList';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { TaskForm } from '@/components/TaskForm';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useAuthStore } from '@/store/authStore';

export function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  useAuthCheck();

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={styles.homePage}>
      <button className={styles.button} onClick={handleAuthAction}>
        {isAuthenticated ? 'Выйти' : 'Войти'}
      </button>
      <TaskForm />
      <TaskList />
    </div>
  );
}
