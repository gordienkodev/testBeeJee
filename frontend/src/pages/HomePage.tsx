import { TaskList } from '../components/TaskList';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { TaskForm } from '@/components/TaskForm';
import { useLogin } from '@/hooks/useLogin';

export function HomePage() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useLogin();

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={styles.homePage}>
      <button onClick={handleAuthAction}>{isAuthenticated ? 'Выйти' : 'Войти'}</button>
      <TaskForm />
      <TaskList />
    </div>
  );
}
