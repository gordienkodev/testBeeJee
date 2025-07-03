import { TaskList } from '../components/TaskList';
// import { TaskForm } from '../components/TaskForm';

export function HomePage() {
  return (
    <div>
      <h1>Задачи</h1>
      <TaskList />
      {/* <TaskForm /> */}
    </div>
  );
}
