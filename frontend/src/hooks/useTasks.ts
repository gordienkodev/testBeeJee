import { fetchTasks } from '@/api/tasks';
import type { TaskResponse } from '@/api/types';
import { useState, useEffect } from 'react';

interface UseTasksParams {
  page: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const useTasks = ({ page, sortField, sortOrder }: UseTasksParams) => {
  const [data, setData] = useState<TaskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchTasks(page, sortField, sortOrder)
      .then(setData)
      .catch((e) => {
        setError(e.message);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [page, sortField, sortOrder]);

  return { data, loading, error };
};
