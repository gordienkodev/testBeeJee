import { useEffect, useState } from 'react';
import { fetchTasks } from '@/api/tasks';
import type { TaskResponse } from '@/api/types';

export const useTasks = (page: number) => {
  const [data, setData] = useState<TaskResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const json = await fetchTasks(page);
        setData(json);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page]);

  return { data, loading, error };
};
