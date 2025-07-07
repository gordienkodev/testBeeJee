import { useCallback } from 'react';
import { updateTask } from '@/api/tasks';

export function useUpdateTask() {
  const mutate = useCallback(async (id: number, data: { text: string; status: boolean }) => {
    try {
      await updateTask(id, data);
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
      throw error;
    }
  }, []);

  return { updateTask: mutate };
}
