import { useCallback } from 'react';
import { updateTask } from '@/api/tasks';
import { useAuthStore } from '@/store/authStore';

export function useUpdateTask() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const mutate = useCallback(
    async (id: number, data: { text: string; status: boolean }) => {
      try {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
          throw new Error('UNAUTHORIZED');
        }

        await updateTask(id, data);
      } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
        throw error;
      }
    },
    [checkAuth]
  );

  return { updateTask: mutate };
}
