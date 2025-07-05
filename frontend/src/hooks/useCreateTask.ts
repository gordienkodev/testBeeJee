import { useState } from 'react';
import type { TaskInput } from '@/api/types';
import { createTask } from '@/api/tasks';

interface CreateTaskResult {
  loading: boolean;
  error: string | null;
  createTask: (task: TaskInput) => Promise<void>;
}

export const useCreateTask = (): CreateTaskResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTaskHandler = async (task: TaskInput) => {
    setLoading(true);
    setError(null);

    try {
      await createTask(task);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createTask: createTaskHandler };
};
