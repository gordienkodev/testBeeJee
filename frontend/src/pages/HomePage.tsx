import { TaskList } from '../components/TaskList';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <button className={styles.loginButton} onClick={() => navigate('/login')}>
        Войти
      </button>
      <TaskList />
    </div>
  );
}
