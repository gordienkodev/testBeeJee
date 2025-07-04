import { useEffect, useState } from 'react';
import { fetchTasks } from '@/api/tasks';
import type { Task } from '@/api/types';

export function useTasks(page: number = 1) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    setLoading(true);
    fetchTasks(page)
      .then((res) => {
        setTasks(res.tasks);
        setError(null);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [page]);

  return { tasks, loading, error };
}
