import { useState } from 'react';
import type { TaskInput } from '@/api/types';
import { createTask } from '@/api/tasks';

interface CreateTaskResult {
  loading: boolean;
  error: string | null;
  createTask: (task: TaskInput) => Promise<void>;
  success: boolean;
}

export const useCreateTask = (): CreateTaskResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createTaskHandler = async (task: TaskInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createTask(task);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createTask: createTaskHandler, success };
};
