import { TaskList } from '../components/TaskList';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { TaskForm } from '@/components/TaskForm';

export function HomePage() {
  const navigate = useNavigate();

         const handleAddTask = (newTask: { username: string; email: string; text: string }) => {
    console.log('Добавить задачу:', newTask);
  };
  return (
    <div className={styles.container}>
      <button className={styles.loginButton} onClick={() => navigate('/login')}>
        Войти
      </button>
      
 <TaskForm onAdd={handleAddTask} />
 
      <TaskList />

 

    </div>
  );
}
